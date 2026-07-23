import os
import zipfile
import xml.etree.ElementTree as ET

def extract_docx(docx_path, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    media_out_dir = os.path.join(out_dir, "media")
    os.makedirs(media_out_dir, exist_ok=True)
    
    with zipfile.ZipFile(docx_path, 'r') as zip_ref:
        # Extract all media files
        media_files = [f for f in zip_ref.namelist() if f.startswith("word/media/")]
        media_mapping = {}
        for f in media_files:
            base_name = os.path.basename(f)
            dest_path = os.path.join(media_out_dir, base_name)
            with open(dest_path, "wb") as out_f:
                out_f.write(zip_ref.read(f))
            media_mapping[base_name] = dest_path
            print(f"Extracted media: {base_name}")
            
        # Read relationships to map rId to image name
        rels_xml = ""
        if "word/_rels/document.xml.rels" in zip_ref.namelist():
            rels_xml = zip_ref.read("word/_rels/document.xml.rels").decode('utf-8')
            
        # Parse relationships
        rId_to_media = {}
        if rels_xml:
            root = ET.fromstring(rels_xml)
            for elem in root:
                rid = elem.attrib.get('Id')
                target = elem.attrib.get('Target')
                type_uri = elem.attrib.get('Type')
                if rid and target and type_uri and "image" in type_uri:
                    rId_to_media[rid] = os.path.basename(target)
        
        # Read document XML
        doc_xml = zip_ref.read("word/document.xml")
        root = ET.fromstring(doc_xml)
        
        # Define XML namespaces
        namespaces = {
            'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
            'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
            'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
            'wp': 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing',
            'pic': 'http://schemas.openxmlformats.org/drawingml/2006/picture'
        }
        
        markdown_lines = []
        
        # Helper to extract text from an element
        def get_elem_text(elem):
            text_parts = []
            for t in elem.findall('.//w:t', namespaces):
                if t.text:
                    text_parts.append(t.text)
            return "".join(text_parts)

        # Traverse body elements directly in order
        body = root.find('w:body', namespaces)
        if body is not None:
            for child in body:
                tag = child.tag
                if tag.endswith('}p'):
                    p_text = ""
                    # Check for drawings/images inside the paragraph
                    drawings = child.findall('.//w:drawing', namespaces)
                    for drawing in drawings:
                        blips = drawing.findall('.//a:blip', namespaces)
                        for blip in blips:
                            embed_id = blip.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed')
                            if embed_id in rId_to_media:
                                img_name = rId_to_media[embed_id]
                                p_text += f"\n\n![{img_name}](media/{img_name})\n\n"
                    
                    # Extract text runs
                    runs_text = get_elem_text(child)
                    p_text += runs_text
                    
                    if p_text.strip():
                        markdown_lines.append(p_text.strip())
                        
                elif tag.endswith('}tbl'):
                    rows = child.findall('.//w:tr', namespaces)
                    table_lines = []
                    for idx, row in enumerate(rows):
                        cells = row.findall('.//w:tc', namespaces)
                        cell_texts = []
                        for cell in cells:
                            cell_p_texts = []
                            for p in cell.findall('.//w:p', namespaces):
                                txt = get_elem_text(p)
                                if txt:
                                    cell_p_texts.append(txt)
                            cell_texts.append(" ".join(cell_p_texts).replace("|", "\\|"))
                        
                        row_str = "| " + " | ".join(cell_texts) + " |"
                        table_lines.append(row_str)
                        
                        if idx == 0:
                            sep = "| " + " | ".join(["---"] * len(cell_texts)) + " |"
                            table_lines.append(sep)
                    
                    if table_lines:
                        markdown_lines.append("\n" + "\n".join(table_lines) + "\n")
        
        # Write markdown output
        md_path = os.path.join(out_dir, "ERROR_REPORT.md")
        with open(md_path, "w", encoding="utf-8") as f:
            f.write("\n\n".join(markdown_lines))
            
        print(f"Extraction complete! Markdown saved to {md_path}")

if __name__ == "__main__":
    docx_p = r"c:\Users\adity\Desktop\Projects\Soulamore-Website\reports\testing\01-inbox\Aryan\ERROR REPORT.docx"
    out_d = r"c:\Users\adity\Desktop\Projects\Soulamore-Website\reports\testing\01-inbox\Aryan"
    extract_docx(docx_p, out_d)
