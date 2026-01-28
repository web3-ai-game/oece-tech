import fitz  # PyMuPDF
from rapidocr_onnxruntime import RapidOCR
import logging
import os
import time
from pathlib import Path

# Initialize logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("PDFProcessor")

class PDFProcessor:
    def __init__(self):
        # Initialize OCR engine
        # Ancient books often have vertical text, so use_angle_cls=True is important.
        try:
            self.ocr = RapidOCR(use_angle_cls=True, use_det=True, use_rec=True)
            logger.info("✅ RapidOCR engine initialized successfully (Ancient Book Mode: Angle CLS Enabled)")
        except Exception as e:
            logger.error(f"❌ Failed to initialize RapidOCR: {e}")
            self.ocr = None

    def is_scanned_page(self, page, text_threshold=50):
        """
        Check if a page is likely scanned (image-based) by checking text length.
        """
        text = page.get_text()
        return len(text.strip()) < text_threshold

    def extract_content(self, pdf_path, output_path=None):
        """
        Extract content from PDF, using OCR if necessary.
        Returns the extracted markdown content.
        """
        start_time = time.time()
        doc = fitz.open(pdf_path)
        total_pages = len(doc)
        logger.info(f"📖 Processing: {os.path.basename(pdf_path)} ({total_pages} pages)")

        full_content = []
        
        # Add metadata
        full_content.append(f"# {os.path.basename(pdf_path)}\n")
        full_content.append(f"**Processed at**: {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
        full_content.append(f"**Total Pages**: {total_pages}\n")
        full_content.append("---\n")

        ocr_pages = 0
        text_pages = 0

        for i, page in enumerate(doc):
            page_num = i + 1
            # logger.debug(f"Processing page {page_num}/{total_pages}")
            
            # 1. Try direct text extraction first
            text = page.get_text()
            
            # 2. Check if we need OCR
            if len(text.strip()) < 50:
                # Likely scanned page
                if self.ocr:
                    # Render page to image
                    pix = page.get_pixmap(dpi=200) # 200 DPI is usually good balance
                    img_data = pix.tobytes("png")
                    
                    # Run OCR
                    # rapidocr accepts bytes or numpy array
                    ocr_result, _ = self.ocr(img_data)
                    
                    if ocr_result:
                        # ocr_result is a list of [box, text, score]
                        text = "\n".join([res[1] for res in ocr_result])
                        ocr_pages += 1
                    else:
                        text = "[OCR Failed or Empty Page]"
                else:
                    text = "[Scanned Page - No OCR Engine Available]"
            else:
                text_pages += 1

            # 3. Format page content
            full_content.append(f"\n## Page {page_num}\n")
            full_content.append(text)
            
            if page_num % 10 == 0:
                logger.info(f"  Progress: {page_num}/{total_pages} pages...")

        doc.close()
        
        # Combine content
        markdown_text = "\n".join(full_content)
        
        # Statistics
        elapsed = time.time() - start_time
        logger.info(f"✅ Finished {os.path.basename(pdf_path)}")
        logger.info(f"  Time: {elapsed:.1f}s ({elapsed/total_pages:.2f}s/page)")
        logger.info(f"  Text Pages: {text_pages}, OCR Pages: {ocr_pages}")

        # Save to file if requested
        if output_path:
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(markdown_text)
            logger.info(f"💾 Saved to: {output_path}")

        return markdown_text, {
            'total_pages': total_pages,
            'text_pages': text_pages,
            'ocr_pages': ocr_pages,
            'duration': elapsed
        }

def main():
    import sys
    if len(sys.argv) < 2:
        print("Usage: python3 pdf_processor.py <pdf_file> [output_md]")
        return
    
    pdf_file = sys.argv[1]
    output_md = sys.argv[2] if len(sys.argv) > 2 else None
    
    if not os.path.exists(pdf_file):
        print(f"File not found: {pdf_file}")
        return

    processor = PDFProcessor()
    processor.extract_content(pdf_file, output_md)

if __name__ == "__main__":
    main()
