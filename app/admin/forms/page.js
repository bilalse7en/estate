import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import { Mail, Phone, Home, MessageSquare, Calendar } from 'lucide-react';

export default async function AdminFormsPage() {
  const supabase = await createClient();
  
  const { data: forms, error } = await supabase
    .from('client_forms')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-navy-900 mb-2">Client Forms</h1>
        <p className="text-gray-600">View and manage client inquiries</p>
      </div>

      {error || !forms || forms.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <p className="text-gray-500">No client forms submitted yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {forms.map((form) => (
            <div
              key={form.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-wrap items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-display font-bold text-navy-900 mb-1">
                    {form.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(form.created_at)}
                  </div>
                </div>
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                  New
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-gray-700">
                  <Mail className="w-5 h-5 text-primary-500" />
                  <span>{form.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <Phone className="w-5 h-5 text-primary-500" />
                  <span>{form.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700 md:col-span-2">
                  <Home className="w-5 h-5 text-primary-500" />
                  <span className="font-semibold">Interest:</span>
                  <span>{form.property_interest}</span>
                </div>
              </div>

              {form.message && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-start space-x-2 text-gray-700">
                    <MessageSquare className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">Message:</p>
                      <p className="text-gray-600">{form.message}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
