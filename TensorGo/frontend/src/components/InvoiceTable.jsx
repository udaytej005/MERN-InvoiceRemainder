import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { invoiceApi } from '../services/api';
import { BellIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

function InvoiceTable({ invoices, onRefresh }) {
  const [loading, setLoading] = useState({});

  const handleTriggerReminder = async (invoiceId) => {
    try {
      setLoading(prev => ({ ...prev, [invoiceId]: true }));
      await invoiceApi.triggerReminder(invoiceId);
      onRefresh();
    } catch (error) {
      console.error('Failed to trigger reminder:', error);
    } finally {
      setLoading(prev => ({ ...prev, [invoiceId]: false }));
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      due: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {status === 'paid' ? (
          <CheckCircleIcon className="mr-1 h-4 w-4" />
        ) : (
          <ExclamationCircleIcon className="mr-1 h-4 w-4" />
        )}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Recipient
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Due Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reminders Sent
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {invoices.map((invoice) => (
            <tr key={invoice._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <Link 
                  to={`/invoice/${invoice._id}`}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  {invoice.recipient}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                ${invoice.amount.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {format(new Date(invoice.dueDate), 'MMM d, yyyy')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(invoice.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {invoice.reminderCount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                {invoice.status === 'due' && (
                  <button
                    onClick={() => handleTriggerReminder(invoice._id)}
                    disabled={loading[invoice._id]}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
                  >
                    {loading[invoice._id] ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <>
                        <BellIcon className="h-4 w-4 mr-1" />
                        Send Reminder
                      </>
                    )}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InvoiceTable;