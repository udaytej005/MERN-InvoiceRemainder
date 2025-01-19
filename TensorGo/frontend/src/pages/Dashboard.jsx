import { useState, useEffect } from 'react';
import { invoiceApi } from '../services/api';
import InvoiceTable from '../components/InvoiceTable';
import InvoiceStats from '../components/InvoiceStats';
import { PlusIcon } from '@heroicons/react/24/outline';
import CreateInvoiceModal from '../components/CreateInvoiceModal';

function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const { data } = await invoiceApi.getAll();
      setInvoices(data);
    } catch (err) {
      setError('Failed to fetch invoices');
      console.error('Error fetching invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async (invoiceData) => {
    try {
      await invoiceApi.create(invoiceData);
      fetchInvoices();
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Error creating invoice:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Invoice
        </button>
      </div>

      <InvoiceStats invoices={invoices} />
      <InvoiceTable 
        invoices={invoices} 
        onRefresh={fetchInvoices}
      />

      <CreateInvoiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateInvoice}
      />
    </div>
  );
}

export default Dashboard;