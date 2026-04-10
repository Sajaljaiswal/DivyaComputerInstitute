export const printCombinedDoc = (student, modulesList, marksArray) => {
  const printWindow = window.open('', '_blank');
  const issueDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const totalSecured = marksArray.reduce((a, b) => a + (parseInt(b) || 0), 0);
  const totalPossible = modulesList.length * 100;
  const percentage = ((totalSecured / totalPossible) * 100).toFixed(2);

  printWindow.document.write(`
    <html>
      <head>
        <title>Certificate - ${student.full_name}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Montserrat:wght@400;700&display=swap');
          @page { size: A4; margin: 0; }
          body { margin: 0; padding: 0; font-family: 'Times New Roman', serif; background: #fff; display: flex; justify-content: center; }
          .cert-outer { width: 210mm; height: 297mm; padding: 5mm; box-sizing: border-box; }
          .cert-container { width: 100%; height: 100%; border: 6px double #8b5e3c; padding: 12mm; background: #fffdf0; box-sizing: border-box; position: relative; display: flex; flex-direction: column; overflow: hidden; }
          
          /* Watermark */
          .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); font-size: 55px; color: rgba(139, 94, 60, 0.03); font-family: 'Cinzel', serif; white-space: nowrap; z-index: 0; pointer-events: none; text-align: center; line-height: 1.5; width: 150%; }
          
          .content-wrapper { position: relative; z-index: 1; flex-grow: 1; display: flex; flex-direction: column; }
          
          /* Straight Header */
          .inst-name-straight { font-family: 'Cinzel', serif; font-size:30px; color: #7c2d12; text-align: center; margin: 6px 0 3px 0; font-weight: 900; letter-spacing: 1px; }
          
          .badge-text { display: inline-block; background: #ea580c; color: white; padding: 4px 20px; border-radius: 50px; font-weight: bold; font-size: 13px; margin: 5px auto; font-family: 'Montserrat', sans-serif; text-transform: uppercase; }
          
          .photo-box { position: absolute; top: 110px; left: 0; width: 110px; height: 135px; border: 2px solid #8b5e3c; background: #fff; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #8b5e3c; font-weight: bold; }
          
        .course-title {
  font-family: 'Cinzel', serif;
  color: #ea580c;
  font-size: 15px;   /* reduced */
  margin: 6px;     /* less spacing */
  font-weight: bold;
  text-align: center;
  word-break: break-word;
  line-height: 1.3;
}
          .content-text { text-align: center; font-size: 15px; line-height: 1.5; margin: 8px 20px 20px 130px; color: #333; }
          .content-text b { color: #1e40af; }
          
          .info-row { display: flex; justify-content: space-between; font-weight: bold; margin: 15px 0; font-size: 14px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
          
          .marks-table { width: 100%; border-collapse: collapse; font-size: 11.5px; border: 2px solid #333; background: white; }
          .marks-table th { background: #7c2d12; color: white; padding: 8px; text-transform: uppercase; border: 1px solid #333; }
          .marks-table td { border: 1px solid #333; padding: 0; }
          .inner-row td { padding: 6px 10px; border: none !important; border-bottom: 1px solid #eee !important; }
          
          .summary-panel { width: 195px; padding: 12px; background: #fef3c7; vertical-align: top; border-left: 2px solid #333 !important; }
          .summary-panel b { display: block; margin-bottom: 5px; color: #7c2d12; font-size: 12px; }

          /* Footer with space for Signature and Mohar */
          .footer { margin-top: auto; padding-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
          
          .seal-section { text-align: center; width: 150px; height: 100px;  display: flex; align-items: center; justify-content: center; color: #000000; font-size: 10px; font-weight: bold; border-radius: 50%; margin-left: 20px; }
          
          .sig-box { text-align: center; width: 250px; }
          .sig-space { height: 60px; } /* Blank space for physical signature */
          .sig-line { border-top: 2px solid #333; padding-top: 8px; font-weight: bold; color: #7c2d12; font-size: 16px; }

          .grade-scale { position: absolute; bottom: 15px; left: 15px; right: 15px; display: flex; font-size: 10px; font-weight: bold; text-align: center; color: white; border-radius: 4px; overflow: hidden; }
          .scale-box { flex: 1; padding: 6px; }
        </style>
      </head>
      <body>
        <div class="cert-outer">
          <div class="cert-container">
            <div class="watermark">DIVYA TECHNICAL INSTITUTE<br>DIVYA TECHNICAL INSTITUTE<br>DIVYA TECHNICAL INSTITUTE</div>
            <div class="content-wrapper">
              
              <div class="header" style="text-align:center;">
                <div style="display:flex; justify-content: space-between; font-size: 11px; font-weight: bold; color: #7c2d12;">
                  <span>Run by BSSST</span>
                  <span>Reg.No. IN-UP58033026783122W</span>
                </div>
                
                <h1 class="inst-name-straight">DIVYA TECHNICAL INSTITUTE</h1>
                
                <div style="text-align:center;"><div class="badge-text">Certificate + Marksheet</div></div>
                <p style="font-size: 12px; margin: 5px 0; color: #666; font-weight: bold;">Vill.+Post Mardah, Distt. Ghazipur (U.P.) — 233226</p>
                <div class="course-title">${student.course_name}</div>
              </div>

              <div class="photo-box">
  ${student.photo_url 
    ? `<img src="${student.photo_url}" style="width:100%; height:100%; object-fit:cover;" />`
    : `STUDENT PHOTO`
  }
</div>
              
              <div class="content-text">
                This is to certify that <b>${student.full_name} D/o ${student.parent_name}</b> has been awarded the 
                <b>${student.course_name}</b> diploma having successfully completed the 
                prescribed curriculum from our center with grade <b>${student.grade}</b>.
              </div>

              <div class="info-row">
                <span>Certificate No: ${student.certificate_no}</span>
                <span>Roll No: ${student.roll_no}</span>
              </div>

              <table class="marks-table">
                <thead>
                  <tr>
                    <th>Modules / Subjects</th>
                    <th style="width:60px; text-align:center;">Max</th>
                    <th style="width:60px; text-align:center;">Secured</th>
                    <th style="width:195px;">Final Result</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colspan="3">
                      <table style="width:100%; border-collapse:collapse;" class="inner-row">
                        ${modulesList.map((name, i) => `
                          <tr>
                            <td style="width:75%; font-weight:bold; color: #444;">${name}</td>
                            <td style="width:12.5%; text-align:center; border-left:1px solid #ddd !important;">100</td>
                            <td style="width:12.5%; text-align:center; border-left:1px solid #ddd !important; font-weight:bold;">${marksArray[i] || 0}</td>
                          </tr>
                        `).join('')}
                      </table>
                    </td>
                    <td class="summary-panel">
                      <b>Total Secured: ${totalSecured} / ${totalPossible}</b>
                      <b>Percentage: ${percentage}%</b>
                      <b>Result Status: PASS</b>
                      <b>Awarded Grade: ${student.grade}</b>
                      <div style="text-align:center; margin-top:20px;">
                        <img style="width:85px;" src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${student.id}" />
                        <p style="font-size:8px; margin-top:5px; color:#7c2d12;">Scan to Verify</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="footer">
                <div class="seal-section">
                <span>Issue Date: ${issueDate}</span>
                </div>

                <div class="sig-box">
                  <div class="sig-space"></div> <div class="sig-line">Santosh Kumar Prajapati</div>
                  <div style="font-size:13px; color:#555; font-weight:bold;">(Director)</div>
                </div>
              </div>
            </div>

            <div class="grade-scale">
               <div class="scale-box" style="background: #1e3a8a;">Excellent: 80-100%</div>
               <div class="scale-box" style="background: #1e40af;">Good: 70-79.9%</div>
               <div class="scale-box" style="background: #1e3a8a;">Fair: 60-69.9%</div>
               <div class="scale-box" style="background: #1e40af;">Satisfactory: 50-59.9%</div>
            </div>
          </div>
        </div>
        <script>window.onload = function() { window.print(); window.close(); }</script>
      </body>
    </html>
  `);
//   printWindow.document.close();
  printWindow.focus();
};