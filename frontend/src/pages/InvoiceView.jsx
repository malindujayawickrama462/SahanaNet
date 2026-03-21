import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInvoice } from '../api/invoiceApi';
import html2pdf from 'html2pdf.js';

export default function InvoiceView() {
    const { invoiceId } = useParams();
    const nav = useNavigate();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const invoiceRef = useRef();

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const data = await getInvoice(invoiceId);
                setInvoice(data.invoice);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoice();
    }, [invoiceId]);

    const handleDownloadPDF = () => {
        const element = invoiceRef.current;
        const opt = {
            margin: 10,
            filename: `${invoice.invoiceID}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading Invoice...</div>;

    if (error || !invoice) return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 space-y-4">
            <p className="text-red-400">{error || "Invoice not found"}</p>
            <button onClick={() => nav(-1)} className="text-emerald-400 hover:underline">Go Back</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 p-4 md:p-8 flex flex-col items-center font-sans print:bg-white print:p-0">
            {/* Action Bar (Hidden when printing) */}
            <div className="w-full max-w-3xl mb-6 flex justify-between items-center print:hidden">
                <button onClick={() => nav('/home')} className="text-slate-400 hover:text-white font-bold text-sm">← Back to Dashboard</button>
                <div className="flex gap-3">
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 transition text-sm font-bold"
                    >
                        Print
                    </button>
                    <button
                        onClick={handleDownloadPDF}
                        className="px-4 py-2 bg-emerald-500 text-slate-950 rounded-lg hover:bg-emerald-400 transition text-sm font-black shadow-lg shadow-emerald-500/20"
                    >
                        Download PDF
                    </button>
                </div>
            </div>

            {/* Printable Area */}
            <div
                ref={invoiceRef}
                className="w-full max-w-3xl bg-white text-slate-900 rounded-2xl p-8 md:p-12 shadow-2xl print:shadow-none print:w-full print:max-w-full"
            >
                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-slate-100 pb-8 mb-8">
                    <div>
                        <h1 className="text-4xl font-black text-emerald-500 tracking-tight">INVOICE</h1>
                        <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-sm">SmartQueue Systems</p>
                    </div>
                    <div className="text-right space-y-1">
                        <p className="font-bold text-slate-800">{invoice.canteen?.name}</p>
                        <p className="text-sm text-slate-500">{invoice.canteen?.location || "Campus Premises"}</p>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-8 mb-8 bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Invoice to:</p>
                            <p className="font-bold text-slate-800">{invoice.student?.name}</p>
                            <p className="text-sm text-slate-500">{invoice.student?.email}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Order Reference:</p>
                            <p className="font-bold text-emerald-500">{invoice.order?.orderID}</p>
                            <p className="text-sm font-medium text-slate-600">Pickup: {invoice.order?.timeSlot?.startTime} - {invoice.order?.timeSlot?.endTime}</p>
                        </div>
                    </div>
                    <div className="space-y-4 text-right">
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Invoice No:</p>
                            <p className="font-black text-slate-800 text-lg">{invoice.invoiceID}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Date:</p>
                            <p className="font-bold text-slate-800">{new Date(invoice.createdAt).toLocaleDateString()}</p>
                            <p className="text-sm text-slate-500">{new Date(invoice.createdAt).toLocaleTimeString()}</p>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <table className="w-full text-left border-collapse mb-8">
                    <thead>
                        <tr className="border-b-2 border-slate-200">
                            <th className="py-3 text-xs uppercase text-slate-400 font-bold tracking-wider">Description</th>
                            <th className="py-3 text-xs uppercase text-slate-400 font-bold tracking-wider text-center">Qty</th>
                            <th className="py-3 text-xs uppercase text-slate-400 font-bold tracking-wider text-right">Price</th>
                            <th className="py-3 text-xs uppercase text-slate-400 font-bold tracking-wider text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item, idx) => (
                            <tr key={idx} className="border-b border-slate-100">
                                <td className="py-4 font-bold text-slate-800">{item.name}</td>
                                <td className="py-4 text-center font-medium text-slate-600">{item.quantity}</td>
                                <td className="py-4 text-right text-slate-600">LKR {item.price.toFixed(2)}</td>
                                <td className="py-4 text-right font-bold text-slate-800">LKR {item.amount.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end">
                    <div className="w-full max-w-sm space-y-3">
                        <div className="flex justify-between items-center text-slate-500">
                            <span>Subtotal</span>
                            <span className="font-medium">LKR {invoice.subTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-500">
                            <span>Tax (5%)</span>
                            <span className="font-medium">LKR {invoice.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-500 pb-3 border-b border-slate-200">
                            <span>Platform Fee</span>
                            <span className="font-medium">LKR {invoice.serviceCharge.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-emerald-500 font-black text-2xl pt-2">
                            <span>Total</span>
                            <span>LKR {invoice.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Message */}
                <div className="mt-16 text-center text-slate-400 text-sm">
                    <p>Thank you for using SmartQueue!</p>
                    <p>Present the Order Reference token at the counter during your pickup window.</p>
                </div>
            </div>

            {/* Custom Styles for Print */}
            <style jsx="true">{`
                @media print {
                    @page { size: auto; margin: 0mm; }
                    body { background-color: white; }
                }
            `}</style>
        </div>
    );
}
