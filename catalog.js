async function generatePDF() {
    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pages = document.querySelectorAll('.catalog-page');
        const totalPages = pages.length;
        
        // Show loading message
        const btn = document.querySelector('.btn-download');
        const originalText = btn.textContent;
        btn.textContent = 'در حال ایجاد PDF...';
        btn.disabled = true;

        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            
            // Set background for canvas
            const canvas = await html2canvas(page, {
                backgroundColor: '#000000',
                scale: 2,
                useCORS: true,
                logging: false,
                width: 794, // A4 width in pixels at 96dpi
                height: 1123 // A4 height in pixels at 96dpi
            });

            const imgData = canvas.toDataURL('image/png');
            
            // Add page (except first)
            if (i > 0) {
                pdf.addPage();
            }
            
            // Calculate dimensions to fit A4
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;
            
            // Center image if it's smaller than page
            let yPos = 0;
            if (imgHeight < pdfHeight) {
                yPos = (pdfHeight - imgHeight) / 2;
            }
            
            pdf.addImage(imgData, 'PNG', 0, yPos, imgWidth, imgHeight);
        }

        // Save PDF
        pdf.save('کاتالوگ-پری-گلد.pdf');
        
        // Reset button
        btn.textContent = originalText;
        btn.disabled = false;
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('خطا در ایجاد PDF. لطفاً دوباره تلاش کنید.');
        const btn = document.querySelector('.btn-download');
        btn.textContent = 'دانلود PDF';
        btn.disabled = false;
    }
}
