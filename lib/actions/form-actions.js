'use server';

import { createClient } from '@/lib/supabase/server';
import { sendInquiryResponseEmail } from '@/lib/email/mailer';
import { isAbortError, logError } from '@/lib/utils/error-handler';

export async function respondToInquiry(formData) {
  try {
    const supabase = await createClient();
    if (!supabase) return { error: 'Supabase client unavailable' };

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const id = formData.get('id');
    const response = formData.get('response');
    const customerEmail = formData.get('email');
    const customerName = formData.get('name');
    const propertyInterest = formData.get('property_interest');

    if (!id || !response) return { error: 'Required fields missing' };

    // Update database - mark as 'responded' after successful dispatch
    const { error: dbError } = await supabase
      .from('client_forms')
      .update({
        admin_response: response,
        responded_at: new Date().toISOString(),
        status: 'responded'
      })
      .eq('id', id);

    if (dbError) {
      console.error('CRITICAL: Inquiry update failed for ID', id, dbError);
      
      // Determine if it's a schema issue (missing columns)
      if (dbError.code === '42703') {
        return { error: 'CRITICAL SCHEMA ERROR: The database is missing "admin_response" or "responded_at" columns. Please run the SQL migration in /supabase/update_inquiries.sql' };
      }
      
      // Determine if it's a constraint issue (status check)
      if (dbError.code === '23514') {
        return { error: 'SYSTEM CONSTRAINT ERROR: The status "responded" is not allowed in your database settings. Please run the SQL query provided to unlock this feature.' };
      }

      return { error: `Failed to update record: ${dbError.message || 'Unknown database error'}. Code: ${dbError.code}` };
    }

    // Send email
    const emailResult = await sendInquiryResponseEmail(
      customerEmail,
      customerName,
      response, // This correctly contains HTML + Attachment links
      propertyInterest
    );

    if (!emailResult.success) {
      console.warn('Dispatch partial failure: Record updated but email suppressed:', emailResult.error);
      return { 
        success: true, 
        warning: 'Inquiry marked as reviewed, but the email notification failed to reach the client. Error: ' + emailResult.error
      };
    }

    return { success: true };
  } catch (error) {
    const { isAbort } = logError('respondToInquiry', error);
    if (isAbort) return { error: 'Request cancelled' };
    return { error: error.message };
  }
}

export async function deleteInquiry(id) {
  try {
    const supabase = await createClient();
    if (!supabase) return { error: 'Supabase client unavailable' };

    // 1. First, get all media attached to this inquiry
    const { data: attachedMedia, error: mediaFetchError } = await supabase
      .from('media')
      .select('id, storage_path')
      .eq('inquiry_id', id);

    if (mediaFetchError) {
      console.warn('Could not fetch attached media:', mediaFetchError);
    }

    // 2. Delete media files from storage
    if (attachedMedia && attachedMedia.length > 0) {
      const storagePaths = attachedMedia.map(m => m.storage_path);
      const { error: storageError } = await supabase
        .storage
        .from('media')
        .remove(storagePaths);

      if (storageError) {
        console.warn('Some media files could not be deleted from storage:', storageError);
      }

      // 3. Delete media records from database
      const { error: mediaDeleteError } = await supabase
        .from('media')
        .delete()
        .eq('inquiry_id', id);

      if (mediaDeleteError) {
        console.warn('Could not delete media records:', mediaDeleteError);
      }
    }

    // 4. Finally, delete the inquiry itself
    const { error } = await supabase
      .from('client_forms')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    return { 
      success: true, 
      deletedMedia: attachedMedia?.length || 0 
    };
  } catch (error) {
    const { isAbort } = logError('deleteInquiry', error);
    if (isAbort) return { error: 'Request cancelled' };
    return { error: error.message };
  }
}
