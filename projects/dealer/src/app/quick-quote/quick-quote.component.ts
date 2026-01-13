import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { QuickQuoteService } from "./services/quick-quote.service";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { CommonService } from "auro-ui";
import { UdcEmailComponent } from "./components/udc-email/udc-email.component";
import html2pdf from "html2pdf.js";

@Component({
  selector: "app-quick-quote",
  templateUrl: "./quick-quote.component.html",
  styleUrl: "./quick-quote.component.scss",
})
export class QuickQuoteComponent {
  quickQuote: any;
  @Input() hideQuote: boolean;
  currentValue: any;

  constructor(
    private quickquoteService: QuickQuoteService,
    private svc: CommonService,
    private cdr: ChangeDetectorRef
  ) {
   
  }

  ngOnInit() {
    this.quickQuote = this.quickquoteService.quickQuote;
  }



  currentDisableValue: boolean = true;
  ngOnDestroy(): void {
    for (let index = 0; index < this.quickQuote.length; index++) {
      if (this.quickQuote[index]) {
        this.quickQuote[index].products = null;
        this.quickQuote[index].programType = null;
        this.quickQuote[index].cashPrice = "";
        this.quickQuote[index].depositePercentage = "";
        this.quickQuote[index].cashDeposite = "";
        this.quickQuote[index].balloonAmountInPercentage = "";
        this.quickQuote[index].balloonAmount = "";
        this.quickQuote[index].interestRate = "";
        this.quickQuote[index].term = "";
        this.quickQuote[index].repaymentFrequency = null;
        if (index == 0) {
          this.quickQuote[index].form = true;
        } else {
          this.quickQuote[index].form = false;
        }
      }
    }
  }

  async saveSnapshot() {
    return new Promise<void>((resolve) => {
      html2canvas(document.body).then((canvas) => {
        const img = canvas.toDataURL();
        this.quickquoteService.setCapturedImage(img);

        resolve();
      });
    });
  }

  async mail() {
    await this.saveSnapshot();
    this.svc.dialogSvc
      .show(UdcEmailComponent, "Email", {
        templates: {
          footer: null,
        },
        data: {
          theData: this.quickquoteService.getCapturedImage(),
        },

        // height : '40vw',
        width: "40vw",
        contentStyle: { overflow: "auto" },
        styleClass: "dialogue-scroll",
        position: "center",
      })
      .onClose.subscribe((data: any) => {});
  }

  onDownload() {
    html2canvas(document.body).then((canvas) => {
      var imgWidth = 208;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Calculate the scaling factor to fit the content within one page
      const scaleFactor = imgHeight > 297 ? 297 / imgHeight : 1; // 297mm is the height of an A4 paper

      // Apply the scale factor to the width and height
      imgWidth = imgWidth * scaleFactor;
      imgHeight = imgHeight * scaleFactor;

      var img = canvas.toDataURL();
      let pdf = new jsPDF("p", "mm", "a4"); // A4 size paper
      var position = 0;

      // Add the image to the PDF with adjusted size
      pdf.addImage(img, "PNG", 0, position, imgWidth, imgHeight);

      // Save the PDF
      pdf.save("quickQuote.pdf");
    });
  }

  onPrintaa() {
    const layoutMain: any = document.querySelector(".layout-main");
    if (!layoutMain) {
      console.error("Layout main container not found");
      return;
    }

    const logoContainer: any = document.querySelector(
      ".layout-topbar-logo.py-0"
    );
    if (!logoContainer) {
      console.error("Logo container not found");
      return;
    }

    // Adjust logo styles for print
    logoContainer.style.height = "55px";
    logoContainer.style.marginLeft = "3px";
    const logoImage = logoContainer.querySelector("img");
    if (logoImage) {
      logoImage.style.height = "35px";
      logoImage.style.width = "auto";
      logoImage.style.margin = "10px";
      logoImage.style.alignItems = "center";
    }

    // Create a temporary wrapper for the topbar
    const tempTopbar = document.createElement("div");
    tempTopbar.style.backgroundColor = "#0f86b1";
    tempTopbar.style.display = "flex";
    tempTopbar.style.alignItems = "center";
    tempTopbar.style.justifyContent = "flex-start";
    tempTopbar.style.height = "60px";
    tempTopbar.style.borderRadius = "12px";

    // Clone the logo element for print
    const clonedLogo = logoContainer.cloneNode(true);
    clonedLogo.style.backgroundColor = "#fff";
    clonedLogo.style.borderRadius = "12px";
    clonedLogo.style.display = "flex";
    clonedLogo.style.alignItems = "center";
    clonedLogo.style.width = "150px";

    tempTopbar.appendChild(clonedLogo);
    document.body.appendChild(tempTopbar);

    // Create a temporary wrapper for the footer
    const tempFooter = document.createElement("div");
    tempFooter.style.backgroundColor = "#0f86b1";
    tempFooter.style.color = "white";
    tempFooter.style.fontSize = "12px";
    tempFooter.style.height = "150px";
    tempFooter.style.display = "flex";
    tempFooter.style.alignItems = "center";
    tempFooter.style.padding = "20px";
    tempFooter.innerHTML = `
      <div>
        <p style="margin: 0;"><strong>PHONE:</strong> 0800 500 832 &nbsp; | &nbsp; <strong>EMAIL:</strong> udcfeedback@udc.co.nz &nbsp; | &nbsp; <strong>WEBSITE:</strong> udc.co.nz</p>
        <br/>
        <p style="margin: 0;"><strong>UDC FINANCE LIMITED</strong></p>
      </div>
    `;
    document.body.appendChild(tempFooter);

    const scale = 5;

    setTimeout(() => {
      Promise.all([
        html2canvas(tempTopbar, { scale }),
        html2canvas(layoutMain, { scale }),
        html2canvas(tempFooter, { scale }),
      ])
        .then(([topbarCanvas, layoutMainCanvas, footerCanvas]) => {
          const topbarImg = topbarCanvas.toDataURL("image/png");
          const layoutMainImg = layoutMainCanvas.toDataURL("image/png");
          const footerImg = footerCanvas.toDataURL("image/png");
          document.body.removeChild(tempTopbar);
          document.body.removeChild(tempFooter);

          const printFrame = document.createElement("iframe");
          printFrame.style.display = "none";
          document.body.appendChild(printFrame);

          const printDocument = printFrame.contentWindow.document;
          printDocument.open();
          printDocument.write(`
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Print Quick Quote</title>
                <style>
                  body {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                  }
  
                  img {
                    display: block;
                    width: 100%;
                    height: auto;
                    float: none;
                  }
  
                  .topbar {
                    background-color: #0f86b1;
                    display: flex;
                    align-items: center;
                  }
  
                  .content img {
                    margin-top: 10px;
                  }
  
                  .disclaimer {
                    font-size: 10px;
                    color: #333;
                    margin-top: 10px;
                  }
  
                </style>
              </head>
              <body>
                <div class="topbar">
                  <img src="${topbarImg}" />
                </div>
                <div class="content">
                  <img src="${layoutMainImg}" />
                </div>
                <div class="disclaimer">
                  <p>Disclaimer: This “Quick Quote Calculator“ is intended to give you some examples of different finance scenarios. The results are for illustrative purposes only and are not legally binding. The calculations are estimates and do not constitute a loan application or an offer of finance from UDC Finance Limited (“UDC”) nor is it a recommendation or opinion in relation to the relevant products. You should make your own judgements and seek independent legal and financial advice before committing to any loan agreement. To obtain finance from UDC you need to submit a formal application which will be processed subject to UDC's credit approval process and lending criteria. UDC’s terms, conditions and fees apply to any loan. UDC accepts no responsibility for any losses arising from the use of or reliance upon any calculations or conclusions reached using the calculator.</p>
                </div>
                <div class="footer">
                  <img src="${footerImg}" />
                </div>
              </body>
            </html>
          `);
          printDocument.close();

          printFrame.onload = () => {
            printFrame.contentWindow.print();
            document.body.removeChild(printFrame);
          };
        })
        .catch((error) => {
          console.error("Error generating print content:", error);
        });
    }, 100);
  }

  onPrint() {
    const layoutMain = document.querySelector(".layout-main");
    if (!layoutMain) {
      console.error("Layout main container not found");
      return;
    }

    const logoContainer: any = document.querySelector(
      ".layout-topbar-logo.py-0"
    );
    if (!logoContainer) {
      console.error("Logo container not found");
      return;
    }

    const layoutMainClone: any = layoutMain.cloneNode(true);

    // Step 1: Clean up labels (remove asterisks and .required)
    const labels = layoutMainClone.querySelectorAll("label");
    labels.forEach((label) => {
      const asteriskSpan = label.querySelector("span.text-red-500");
      if (asteriskSpan) asteriskSpan.remove();
      label.textContent = label.textContent.replace(/\*/g, "");
      label.classList.remove("required");
    });

    // Step 2: Hide buttons
    layoutMainClone.querySelectorAll("button").forEach((button) => {
      button.style.display = "none";
    });

    // Step 3: Replace <select> with <span> and preserve alignment
    const primeDropdowns = layoutMainClone.querySelectorAll(".p-dropdown");

    primeDropdowns.forEach((dropdown: HTMLElement) => {
      // Get selected label
      const labelEl = dropdown.querySelector(".p-dropdown-label");
      const selectedText = labelEl?.textContent?.trim() || "";

      // Create wrapper div to mimic layout and align right
      const wrapper = document.createElement("div");
      wrapper.style.display = "flex";
      wrapper.style.justifyContent = "flex-end";
      wrapper.style.alignItems = "center";
      wrapper.style.width = "100%";
      wrapper.style.minHeight = dropdown.offsetHeight + "px";

      // Create span to show selected value
      const span = document.createElement("span");
      span.textContent = selectedText;
      span.style.display = "inline-block";
      span.style.width = "100%"; // Fill the space for alignment
      span.style.textAlign = "right";
      span.style.padding = "6px 8px";
      span.style.border = "none";
      span.style.background = "transparent";
      span.style.boxSizing = "border-box";
      span.style.minHeight = dropdown.offsetHeight + "px";

      // ✅ Word wrap styles
      span.style.whiteSpace = "normal"; // Allow wrapping
      span.style.wordBreak = "break-word"; // Break long words if needed
      span.style.overflowWrap = "break-word";

      // Copy text styles from label
      if (labelEl) {
        const computedStyles = window.getComputedStyle(labelEl);
        ["fontSize", "fontFamily", "lineHeight", "color", "fontWeight"].forEach(
          (prop) => {
            span.style[prop] = computedStyles[prop];
          }
        );
      }

      // Replace dropdown with styled wrapper
      wrapper.appendChild(span);
      dropdown.parentNode.replaceChild(wrapper, dropdown);
    });

    // Step 4: Remove dropdown triggers
    layoutMainClone
      .querySelectorAll(".p-dropdown-trigger")
      .forEach((trigger) => {
        trigger.remove();
      });

    // Step 5: Style inputs and components
    layoutMainClone.querySelectorAll("input, select").forEach((input) => {
      input.style.border = "none";
      input.style.background = "transparent";
      input.style.outline = "none";
      input.style.boxShadow = "none";
      input.style.padding = "0px";
      input.style.margin = "0px";
      input.style.appearance = "none";
      input.style.webkitAppearance = "none";
      input.style.mozAppearance = "none";
    });

    layoutMainClone
      .querySelectorAll(".p-inputtext, .p-dropdown, .p-component")
      .forEach((element) => {
        element.style.border = "none";
        element.style.background = "transparent";
        element.style.boxShadow = "none";
      });

    // Step 6: Adjust logo
    logoContainer.style.height = "55px";
    logoContainer.style.marginLeft = "3px";
    const logoImage = logoContainer.querySelector("img");
    if (logoImage) {
      logoImage.style.height = "35px";
      logoImage.style.width = "auto";
      logoImage.style.margin = "5px";
      logoImage.style.alignItems = "center";
    }

    // Step 7: Create header
    const tempTopbar = document.createElement("div");
    tempTopbar.style.backgroundColor = "#0f86b1";
    tempTopbar.style.display = "flex";
    tempTopbar.style.alignItems = "center";
    tempTopbar.style.justifyContent = "flex-start";
    tempTopbar.style.height = "60px";
    tempTopbar.style.borderRadius = "12px";
    tempTopbar.style.width = "794px";

    const clonedLogo = logoContainer.cloneNode(true);
    clonedLogo.style.backgroundColor = "#fff";
    clonedLogo.style.borderRadius = "12px";
    clonedLogo.style.display = "flex";
    clonedLogo.style.alignItems = "center";
    clonedLogo.style.width = "150px";
    tempTopbar.appendChild(clonedLogo);
    document.body.appendChild(tempTopbar);

    // Step 8: Create footer
    const tempFooter = document.createElement("div");
    tempFooter.style.backgroundColor = "#0f86b1";
    tempFooter.style.color = "white";
    tempFooter.style.fontSize = "12px";
    tempFooter.style.height = "100px";
    tempFooter.style.display = "flex";
    tempTopbar.style.alignItems = "center";
    tempFooter.style.padding = "20px";
    tempFooter.style.width = "794px";
    tempFooter.innerHTML = `
    <div>
      <p style="margin: 0;"><strong>PHONE:</strong> 0800 500 832   |   <strong>EMAIL:</strong> udcfeedback@udc.co.nz   |   <strong>WEBSITE:</strong> udc.co.nz</p>
      <br/>
      <p style="margin: 0;"><strong>UDC FINANCE LIMITED</strong></p>
    </div>
  `;
    document.body.appendChild(tempFooter);

    // Step 9: Prepare cloned layout for canvas
    layoutMainClone.style.position = "absolute";
    layoutMainClone.style.left = "-9999px";
    layoutMainClone.style.width = "794px";
    layoutMainClone.style.boxSizing = "border-box";
    layoutMainClone.style.overflow = "auto"; // Prevent content from being clipped
    document.body.appendChild(layoutMainClone);

    // Step 10: Render canvases
    const scale = 2;
    setTimeout(() => {
      Promise.all([
        html2canvas(tempTopbar, { scale }),
        html2canvas(layoutMainClone, { scale, width: 794 }),
        html2canvas(tempFooter, { scale }),
      ])
        .then(([topbarCanvas, layoutMainCanvas, footerCanvas]) => {
          const topbarImg = topbarCanvas.toDataURL("image/png");
          const layoutMainImg = layoutMainCanvas.toDataURL("image/png");
          const footerImg = footerCanvas.toDataURL("image/png");

          // Cleanup
          document.body.removeChild(tempTopbar);
          document.body.removeChild(tempFooter);
          document.body.removeChild(layoutMainClone);

          // Create print frame
          const printFrame = document.createElement("iframe");
          printFrame.style.display = "none";
          document.body.appendChild(printFrame);

          const printDocument = printFrame.contentWindow.document;
          printDocument.open();
          printDocument.write(`
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <title>Print Quick Quote</title>
              <style>
                @page {
                  size: A4 portrait;
                  margin: 0;
                }
                @media print {
                  body {
                    margin: 0;
                    padding: 0;
                  }
                }
                body {
                  margin: 0;
                  padding: 0;
                  font-family: Arial, sans-serif;
                  width: 794px;
                  min-height: 1123px;
                  box-sizing: border-box;
                }
                .container {
                  width: 100%;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                }
                img {
                  display: block;
                  width: 100%;
                  height: auto;
                }
                .topbar, .footer {
                  width: 100%;
                }
                .content img {
                  width: 100%;
                  max-height: 700px; /* Increased to accommodate more content */
                  object-fit: contain;
                }
                .footer img {
                  height: 100px;
                }
                .disclaimer {
                  font-size: 8px;
                  color: #333;
                  margin-top: 5px;
                  padding: 0 20px;
                  width: 100%;
                }
                .p-component, .p-grid {
                  margin: 0 !important;
                  padding: 0 !important;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="topbar">
                  <img src="${topbarImg}" />
                </div>
                <div class="content">
                  <img src="${layoutMainImg}" />
                </div>
                <div class="disclaimer">
                  <p>Disclaimer: This “Quick Quote Calculator“ is intended to give you some examples of different finance scenarios. The results are for illustrative purposes only and are not legally binding. The calculations are estimates and do not constitute a loan application or an offer of finance from UDC Finance Limited (“UDC”) nor is it a recommendation or opinion in relation to the relevant products. You should make your own judgements and seek independent legal and financial advice before committing to any loan agreement. To obtain finance from UDC you need to submit a formal application which will be processed subject to UDC's credit approval process and lending criteria. UDC’s terms, conditions and fees apply to any loan. UDC accepts no responsibility for any losses arising from the use of or reliance upon any calculations or conclusions reached using the calculator.</p>
                </div>
                <div class="footer">
                  <img src="${footerImg}" />
                </div>
              </div>
            </body>
          </html>
        `);
          printDocument.close();

          printFrame.onload = () => {
            printFrame.contentWindow.focus();
            printFrame.contentWindow.print();
            document.body.removeChild(printFrame);
          };
        })
        .catch((error) => {
          console.error("Error generating print content:", error);
        });
    }, 100);
  }

  async generatePrintCanvas(): Promise<HTMLCanvasElement> {
    const layoutMain = document.querySelector(
      ".layout-main"
    ) as HTMLElement | null;
    const logoContainer: any = document.querySelector(
      ".layout-topbar-logo.py-0"
    ) as HTMLElement | null;

    if (!layoutMain) throw new Error("Layout main container not found");
    if (!logoContainer) throw new Error("Logo container not found");

    // Clone main layout and logo
    const layoutClone = layoutMain.cloneNode(true) as HTMLElement;
    // const logoClone = logoContainer.cloneNode(true) as HTMLElement;

    // const setPrintStyles = (el: HTMLElement) => {
    //   el.style.boxSizing = "border-box";
    //   el.style.margin = "auto";
    //   el.style.background = "#fff";
    //   // el.style.width = '150';
    // };

    // setPrintStyles(logoClone);

    // Adjust logo styles for print
    logoContainer.style.height = "55px";
    logoContainer.style.marginLeft = "3px";
    const logoImage = logoContainer.querySelector("img");
    if (logoImage) {
      logoImage.style.height = "35px";
      logoImage.style.width = "auto";
      logoImage.style.margin = "10px";
      logoImage.style.alignItems = "center";
    }

    // Create a temporary wrapper for the topbar
    const tempTopbar = document.createElement("div");
    tempTopbar.style.backgroundColor = "#0f86b1";
    tempTopbar.style.display = "flex";
    tempTopbar.style.alignItems = "center";
    tempTopbar.style.justifyContent = "flex-start";
    tempTopbar.style.height = "60px";
    tempTopbar.style.borderRadius = "12px";
    tempTopbar.style.marginBottom = "20px";

    // Clone the logo element for print
    const clonedLogo = logoContainer.cloneNode(true);
    clonedLogo.style.backgroundColor = "#fff";
    clonedLogo.style.borderRadius = "12px";
    clonedLogo.style.display = "flex";
    clonedLogo.style.alignItems = "center";
    clonedLogo.style.width = "150px";

    tempTopbar.appendChild(clonedLogo);
    // document.body.appendChild(tempTopbar);

    // Clean labels
    layoutClone.querySelectorAll("label").forEach((label) => {
      label.querySelector("span.text-red-500")?.remove();
      label.textContent = label.textContent?.replace(/\*/g, "") ?? "";
      label.classList.remove("required");
    });

    // Remove buttons
    layoutClone
      .querySelectorAll("button")
      .forEach((btn) => (btn.style.display = "none"));

    // Replace PrimeNG dropdowns with spans
    layoutClone.querySelectorAll("p-dropdown").forEach((dropdown) => {
      const labelEl = dropdown.querySelector(".p-dropdown-label");
      //    const ngName = dropdown.getAttribute("ng-reflect-name") || "";
      // const isTarget = ngName.includes("productId") || ngName.includes("programId");
      const selectedText = labelEl?.textContent?.trim() ?? "";
      const spanParent = dropdown.closest("span");
      const label = spanParent?.querySelector("label");
      const labelText = label?.textContent.trim().toLowerCase();
      const isTarget =
        labelText?.includes("product") || labelText?.includes("program");

      const span = document.createElement("span");
      span.textContent = selectedText;
      span.style.cssText = `
      display: block;
      width: 100%;
      padding: 6px 8px;
      background: transparent;
      border: none;
      white-space: normal;
      word-break: break-word;
       text-align: ${isTarget ? "" : "right"};
      `;

      if (labelEl) {
        const compStyles = window.getComputedStyle(labelEl);
        ["fontSize", "fontFamily", "lineHeight", "color", "fontWeight"].forEach(
          (prop) => {
            (span.style as any)[prop] = compStyles[prop];
          }
        );
      }

      dropdown.parentNode?.replaceChild(span, dropdown);
    });

    layoutClone
      .querySelectorAll(".p-dropdown-trigger")
      .forEach((el) => el.remove());

    layoutClone.querySelectorAll("input, select").forEach((el) => {
      const e = el as HTMLElement;
      Object.assign(e.style, {
        border: "none",
        background: "transparent",
        outline: "none",
        boxShadow: "none",
        padding: "0",
        margin: "0",
        marginTop:"5px",
        appearance: "none",
        height: "20px",
        lineHeight: "15px",
        boxSizing: "border-box",
      });
    });

    // // Style the logo image
    // const logoImg = logoClone.querySelector("img");
    // if (logoImg) {
    //   // logoImg.style.height = "50px";
    //   // logoImg.style.width = "150px";
    //   logoImg.style.background = "#fff"
    //   logoImg.style.border = "2px";
    //   logoImg.style.borderLeftColor = "#0f86b1"
    //   logoImg.style.borderLeft = "12px"
    //   // logoImg.style.margin = "10px";
    //   // logoImg.style.marginBottom = "0px";
    // }

    // // Topbar with ONLY logo
    // const topbar = document.createElement("div");
    // topbar.style.cssText = `
    //   background-color: #0f86b1;
    //   display: block;
    //   // justify-content: start;
    //   // align-items: center;
    //   height: 60px;
    //   border-radius: 12px;
    //   margin-bottom: 20px;
    //   width: auto;
    //   box-sizing: border-box;
    //   // padding: 10px 10mm;
    // `;
    // topbar.appendChild(logoClone);
    const disclaimer = document.createElement("div");
    disclaimer.innerHTML = ` <div class="disclaimer">
              <p><strong>Disclaimer: <strong>This “Quick Quote Calculator“ is intended to give you some examples of different finance scenarios. The results are for illustrative purposes only and are not legally binding. The calculations are estimates and do not constitute a loan application or an offer of finance from UDC Finance Limited (“UDC”) nor is it a recommendation or opinion in relation to the relevant products. You should make your own judgements and seek independent legal and financial advice before committing to any loan agreement. To obtain finance from UDC you need to submit a formal application which will be processed subject to UDC's credit approval process and lending criteria. UDC’s terms, conditions and fees apply to any loan. UDC accepts no responsibility for any losses arising from the use of or reliance upon any calculations or conclusions reached using the calculator</p>
            </div>`;

    disclaimer.style.cssText = `
    align-items: center;
    padding: 20px 0px;
    width: auto;
  `;

    // Footer
    const footer = document.createElement("div");
    footer.style.cssText = `
    background-color: #0f86b1;
    color: white;
    font-size: 12px;
    height: 100px;
    display: flex;
    align-items: center;
    padding: 10px;
    width: auto;
    box-sizing: border-box;
  `;
    footer.innerHTML = `
    <div>
      <p style="margin:0;"><strong>PHONE:</strong> 0800 500 832 | <strong>EMAIL:</strong> udcfeedback@udc.co.nz | <strong>WEBSITE:</strong> udc.co.nz</p>
      <p style="margin:0;"><strong>UDC FINANCE LIMITED</strong></p>
    </div>
  `;

    // Final print container
    const container = document.createElement("div");
    container.style.cssText = `
    width: 100%;
    box-sizing: border-box;
    background: #fff;
    margin: 0 auto;
    padding: 1mm 0;
  `;
    container.appendChild(tempTopbar);
    container.appendChild(layoutClone);
    container.appendChild(disclaimer);
    container.appendChild(footer);

    // Optional: clone styles to keep look consistent
    const styles = Array.from(
      document.head.querySelectorAll("style, link[rel='stylesheet']")
    );
    styles.forEach((style) => container.appendChild(style.cloneNode(true)));

    // Render canvas
    document.body.appendChild(container);
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#fff",
    });
    document.body.removeChild(container);

    return canvas;
  }

  async onPrintAndDownload(download = false) {
    const programId = this.quickquoteService.quickQuoteData?.[0]?.programId;
    if (!programId) return;
    try {
      const canvas = await this.generatePrintCanvas();
      const imgData = canvas.toDataURL("image/png");

      if (download) {
        const pdf = new jsPDF("p", "mm", "a4");

        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 5; // in mm

        const usableWidth = pageWidth - margin * 2;
        const canvasAspectRatio = canvas.height / canvas.width;
        const scaledCanvasHeight = usableWidth * canvasAspectRatio;

        const imgData = canvas.toDataURL("image/png");

        let currentY = 0;
        let page = 0;

        // Total height in PDF after scaling
        const totalHeightInMM = scaledCanvasHeight;

        while (currentY < totalHeightInMM) {
          if (page > 0) pdf.addPage();

          const sliceHeight = Math.min(
            pageHeight - margin * 2,
            totalHeightInMM - currentY
          );

          pdf.addImage(
            imgData,
            "PNG",
            margin,
            margin,
            usableWidth,
            scaledCanvasHeight,
            undefined,
            "FAST"
          );

          currentY += sliceHeight;
          page++;
        }

        pdf.save("quickQuote.pdf");
      } else {
        // Create hidden iframe to print
        const printFrame = document.createElement("iframe");
        printFrame.style.display = "none";
        document.body.appendChild(printFrame);

        const doc = printFrame.contentWindow?.document;
        if (!doc) throw new Error("No print document");

        doc.open();
        doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Print Quick Quote</title>
            <style>
              @page { size: A4 portrait; margin: 10mm; }
              body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              img {
                width: 100%;
                height: auto;
                display: block;
              }
              .disclaimer {
                font-size: 8px;
                color: #333;
                margin: 15px 0 5px 0;
                padding: 0 10mm;
              }
            </style>
          </head>
          <body>
            <img src="${imgData}" />
          
          </body>
        </html>
      `);
        doc.close();

        printFrame.onload = () => {
          printFrame.contentWindow?.focus();
          printFrame.contentWindow?.print();
          document.body.removeChild(printFrame);
        };
      }
    } catch (err) {
      console.error("Print/download error:", err);
    }
  }

  // onPrint() {
  //   const layoutMain = document.querySelector(".layout-main");
  //   if (!layoutMain) {
  //     console.error("Layout main container not found");
  //     return;
  //   }

  //   const logoContainer:any = document.querySelector(".layout-topbar-logo.py-0");
  //   if (!logoContainer) {
  //     console.error("Logo container not found");
  //     return;
  //   }

  //   // Adjust logo styles for print
  //   logoContainer.style.height = "55px";
  //   logoContainer.style.marginLeft = "3px";
  //   const logoImage = logoContainer.querySelector("img");
  //   if (logoImage) {
  //     logoImage.style.height = "35px";
  //     logoImage.style.width = "auto";
  //     logoImage.style.margin = "10px";
  //     logoImage.style.alignItems = "center";
  //   }

  //   // Create a temporary wrapper for the topbar
  //   const tempTopbar = document.createElement("div");
  //   tempTopbar.style.backgroundColor = "#0f86b1";
  //   tempTopbar.style.display = "flex";
  //   tempTopbar.style.alignItems = "center";
  //   tempTopbar.style.justifyContent = "flex-start";
  //   tempTopbar.style.height = "60px";
  //   tempTopbar.style.borderRadius = "12px";

  //   const clonedLogo = logoContainer.cloneNode(true);
  //   clonedLogo.style.backgroundColor = "#fff";
  //   clonedLogo.style.borderRadius = "12px";
  //   clonedLogo.style.display = "flex";
  //   clonedLogo.style.alignItems = "center";
  //   clonedLogo.style.width = "150px";

  //   tempTopbar.appendChild(clonedLogo);
  //   document.body.appendChild(tempTopbar);

  //   // Create a temporary footer
  //   const tempFooter = document.createElement("div");
  //   tempFooter.style.backgroundColor = "#0f86b1";
  //   tempFooter.style.color = "white";
  //   tempFooter.style.fontSize = "12px";
  //   tempFooter.style.height = "150px";
  //   tempFooter.style.width = "100%";
  //   tempFooter.style.display = "flex";
  //   tempFooter.style.alignItems = "center";
  //   tempFooter.style.padding = "20px";
  //   tempFooter.innerHTML = `
  //     <div>
  //       <p style="margin: 0;"><strong>PHONE:</strong> 0800 500 832   |   <strong>EMAIL:</strong> udcfeedback@udc.co.nz   |   <strong>WEBSITE:</strong> udc.co.nz</p>
  //       <br/>
  //       <p style="margin: 0;"><strong>UDC FINANCE LIMITED</strong></p>
  //     </div>
  //   `;
  //   document.body.appendChild(tempFooter);

  //   const scale = 5;

  //   setTimeout(() => {
  //     Promise.all([
  //       html2canvas(tempTopbar, { scale }),
  //       html2canvas(tempFooter, { scale }),
  //     ])
  //       .then(([topbarCanvas, footerCanvas]) => {
  //         const topbarImg = topbarCanvas.toDataURL("image/png");
  //         const footerImg = footerCanvas.toDataURL("image/png");
  //         document.body.removeChild(tempTopbar);
  //         document.body.removeChild(tempFooter);

  //         const printFrame = document.createElement("iframe");
  //         printFrame.style.display = "none";
  //         document.body.appendChild(printFrame);

  //         const printDocument = printFrame.contentWindow.document;

  //         // Data for the three Quick Quotes (Quick Quote 1 matches the new image)
  //         const quotesData = [
  //           {
  //             title: "Quick Quote 1",
  //             product: "Product Name",
  //             program: "Credit Sales Agreement",
  //             calculateFor: "Payment",
  //             cashPrice: "$12,000.00",
  //             deposit: "$12,000.00 OR 2.50%",
  //             interestRate: "9.5%",
  //             term: "48",
  //             frequency: "48",
  //             payment: "48",
  //             balloon: "$12,000.00 OR 2.50% Fixed",
  //             loanAmount: "$20,000.00",
  //             totalFees: "$20,000.00",
  //             totalInterest: "$200.00",
  //             totalAmountPayable: "$20,200.00",
  //           },
  //           {
  //             title: "Quick Quote 2",
  //             product: "Product Name",
  //             program: "Finance Lease",
  //             cashPrice: "$12,000.00",
  //             initialLeaseAmount: "$12,000.00",
  //             interestRate: "9.5%",
  //             term: "48",
  //             frequency: "Monthly",
  //             leasePayment: "$3,900.00",
  //             residualValue: "$12,000.00 OR 2.50%",
  //             leaseAmount: "$20,000.00",
  //             totalFees: "$200.00",
  //             totalInterest: "$200.00",
  //             totalAmountPayable: "$20,200.00",
  //           },
  //           {
  //             title: "Quick Quote 3",
  //             product: "Product Name",
  //             program: "Assured Future Value",
  //             assetType: "Mazda/4WD/Mazda CX-8 GSX DSL",
  //             cashPrice: "$12,000.00",
  //             deposit: "$12,000.00 OR 2.50%",
  //             interestRate: "9.5%",
  //             term: "48",
  //             kmAllowance: "$12,000.00",
  //             frequency: "Monthly",
  //             payment: "$3,900.00",
  //             assuredFutureValue: "2.50%",
  //             loanAmount: "$20,000.00",
  //             totalFees: "$200.00",
  //             totalInterest: "$200.00",
  //             totalAmountPayable: "$20,200.00",
  //           },
  //         ];

  //         // Generate the HTML for the quotes dynamically
  //         const quotesHtml = quotesData
  //           .map((quote) => `
  //             <div class="quote-box">
  //               <div class="quote-title">${quote.title}</div>
  //               <div class="quote-content">
  //                 <table>
  //                   <tr><td class="label">Product</td><td class="value">${quote.product}</td></tr>
  //                   <tr><td class="label">Program</td><td class="value">${quote.program}</td></tr>
  //                   ${
  //                     quote.calculateFor
  //                       ? `<tr><td class="label">Calculate for</td><td class="value">${quote.calculateFor}</td></tr>`
  //                       : ""
  //                   }
  //                   ${
  //                     quote.assetType
  //                       ? `<tr><td class="label">Asset Type</td><td class="value">${quote.assetType}</td></tr>`
  //                       : ""
  //                   }
  //                   <tr><td class="label">Cash Price</td><td class="value">${quote.cashPrice}</td></tr>
  //                   ${
  //                     quote.deposit
  //                       ? `<tr><td class="label">Deposit</td><td class="value">${quote.deposit.replace(
  //                           "OR",
  //                           '<span class="or-text">OR</span>'
  //                         )}</td></tr>`
  //                       : ""
  //                   }
  //                   ${
  //                     quote.initialLeaseAmount
  //                       ? `<tr><td class="label">Initial Lease Amount</td><td class="value">${quote.initialLeaseAmount}</td></tr>`
  //                       : ""
  //                   }
  //                   <tr><td class="label">Interest Rate</td><td class="value">${quote.interestRate}</td></tr>
  //                   <tr><td class="label">Term (Months)</td><td class="value">${quote.term}</td></tr>
  //                   ${
  //                     quote.kmAllowance
  //                       ? `<tr><td class="label">KM Allowance</td><td class="value">${quote.kmAllowance}</td></tr>`
  //                       : ""
  //                   }
  //                   <tr><td class="label">Frequency</td><td class="value">${quote.frequency}</td></tr>
  //                   ${
  //                     quote.payment
  //                       ? `<tr><td class="label">Payment</td><td class="value">${quote.payment}</td></tr>`
  //                       : ""
  //                   }
  //                   ${
  //                     quote.leasePayment
  //                       ? `<tr><td class="label">Lease Payment</td><td class="value">${quote.leasePayment}</td></tr>`
  //                       : ""
  //                   }
  //                   ${
  //                     quote.balloon
  //                       ? `<tr><td class="label">Balloon</td><td class="value">${quote.balloon.replace(
  //                           "OR",
  //                           '<span class="or-text">OR</span>'
  //                         )}</td></tr>`
  //                       : ""
  //                   }
  //                   ${
  //                     quote.residualValue
  //                       ? `<tr><td class="label">Residual Value</td><td class="value">${quote.residualValue.replace(
  //                           "OR",
  //                           '<span class="or-text">OR</span>'
  //                         )}</td></tr>`
  //                       : ""
  //                   }
  //                   ${
  //                     quote.assuredFutureValue
  //                       ? `<tr><td class="label">Assured Future Value</td><td class="value">${quote.assuredFutureValue}</td></tr>`
  //                       : ""
  //                   }
  //                 </table>
  //               </div>
  //               <div class="amount-fees-box">
  //                 <div class="label">${
  //                   quote.leaseAmount ? "Lease Amount" : "Loan Amount"
  //                 }</div>
  //                 <div class="value">${
  //                   quote.leaseAmount || quote.loanAmount
  //                 }</div>
  //                 <div class="label">Total Fees</div>
  //                 <div class="value">${quote.totalFees}</div>
  //               </div>
  //               <div class="amount-fees-box" style="margin-top: 5px;">
  //                 <div class="label">Total Interest</div>
  //                 <div class="value">${quote.totalInterest}</div>
  //                 <div class="label">Total Amount Payable</div>
  //                 <div class="value"><strong>${quote.totalAmountPayable}</strong></div>
  //               </div>
  //             </div>
  //           `)
  //           .join("");

  //         printDocument.open();
  //         printDocument.write(`
  //           <!DOCTYPE html>
  //           <html lang="en">
  //           <head>
  //             <meta charset="UTF-8" />
  //             <title>Print Quick Quote</title>
  //             <style>
  //               body {
  //                 margin: 0;
  //                 padding: 20px;
  //                 font-family: Arial, sans-serif;
  //                 color: #333;
  //                 background-color: #f5f7fa;
  //               }
  //               .topbar {
  //                 background-color: #0f86b1;
  //                 height: 60px;
  //                 display: flex;
  //                 align-items: center;
  //                 justify-content: flex-start;
  //                 border-radius: 12px 12px 0 0;
  //               }
  //               .topbar img {
  //                 height: 35px;
  //                 width: auto;
  //                 margin: 10px;
  //                 background-color: #fff;
  //                 border-radius: 12px;
  //                 padding: 5px;
  //               }
  //               .quotes-container {
  //                 display: flex;
  //                 justify-content: space-between;
  //                 gap: 15px;
  //                 margin-bottom: 20px;
  //               }
  //               .quote-box {
  //                 flex: 1;
  //                 border: 1px solid #0f86b1;
  //                 border-radius: 8px;
  //                 padding: 15px;
  //                 background: white;
  //                 box-sizing: border-box;
  //                 font-size: 12px;
  //                 display: flex;
  //                 flex-direction: column;
  //                 justify-content: space-between;
  //               }
  //               .quote-title {
  //                 background-color: #0f86b1;
  //                 color: white;
  //                 font-weight: 600;
  //                 font-size: 14px;
  //                 padding: 8px 10px;
  //                 border-radius: 6px 6px 0 0;
  //                 margin: -15px -15px 15px -15px;
  //                 text-align: center;
  //               }

  //               .quote-content {
  //                 flex-grow: 1;
  //               }
  //               .quote-content table {
  //                 width: 100%;
  //                 border-collapse: collapse;
  //               }
  //               .quote-content td {
  //                 padding: 1px 5px;
  //                 vertical-align: top;
  //               }
  //               .quote-content .label {
  //                 font-weight: 600;
  //                 width: 50%;
  //                 color: #333;
  //               }
  //               .quote-content .value {
  //                 width: 50%;
  //                 text-align: right;
  //                 color: #333;
  //                 font-weight: normal;
  //               }
  //               .quote-content .or-text {
  //                 display: inline;
  //                 font-style: italic;
  //                 font-size: 10px;
  //                 color: #666;
  //                 margin: 0 4px;
  //               }
  //               .amount-fees-box {
  //                 border-top: 1px solid #0f86b1;
  //                 margin-top: 10px;
  //                 padding-top: 8px;
  //                 font-weight: 600;
  //                 font-size: 13px;
  //                 display: grid;
  //                 grid-template-columns: auto auto auto auto;
  //                 gap: 2px;
  //                 color: #0f86b1;
  //               }
  //               .amount-fees-box .label {
  //                 font-weight: 600;
  //                 text-align: left;
  //               }
  //               .amount-fees-box .value {
  //                 font-weight: 700;
  //                 text-align: right;
  //               }
  //               .disclaimer {
  //                 font-size: 10px;
  //                 color: #333;
  //                 margin-top: 10px;
  //                 line-height: 1.3;
  //                 max-width: 100%;
  //               }
  //               .footer {
  //                 background-color: #0f86b1;
  //                 height: 150px;
  //                 width: 100%;
  //                 display: flex;
  //                 align-items: center;
  //                 justify-content: flex-start;
  //                 border-radius: 0 0 12px 12px;
  //                 margin-top: 20px;
  //               }
  //               .footer img {
  //                 width: 100%;
  //                 height: 100%;
  //                 object-fit: contain;
  //               }
  //             </style>
  //           </head>
  //           <body>
  //             <div class="topbar">
  //               <img src="${topbarImg}" alt="UDC Logo" />
  //             </div>
  //             <div class="content" id="mainContent">
  //               <div class="quotes-container">
  //                 ${quotesHtml}
  //               </div>
  //               <div class="disclaimer">
  //                 <strong>Disclaimer:</strong> This “Quick Quote Calculator“ is intended to give you some examples of different finance scenarios. The results are for illustrative purposes only and are not legally binding. The calculations are estimates and do not constitute a loan application or an offer of finance from UDC Finance Limited (“UDC”) nor is it a recommendation or opinion in relation to the relevant products. You should make your own judgements and seek independent legal and financial advice before committing to any loan agreement. To obtain finance from UDC you need to submit a formal application which will be processed subject to UDC’s credit approval process and lending criteria. UDC’s terms, conditions and fees apply to any loan. UDC accepts no responsibility for any losses arising from the use of or reliance upon any calculations or conclusions reached using the calculator.
  //               </div>
  //             </div>
  //             <div class="footer">
  //               <img src="${footerImg}" alt="Footer" />
  //             </div>
  //           </body>
  //           </html>
  //         `);
  //         printDocument.close();

  //         // Wait for the iframe content to load
  //         printFrame.onload = () => {
  //           // Copy stylesheets (optional but recommended)
  //           const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'));
  //           stylesheets.forEach(styleNode => {
  //             const clonedStyle = styleNode.cloneNode(true);
  //             printFrame.contentDocument.head.appendChild(clonedStyle);
  //           });

  //           // Wait a little to ensure styles apply, then print
  //           setTimeout(() => {
  //             printFrame.contentWindow.focus();
  //             printFrame.contentWindow.print();
  //             document.body.removeChild(printFrame);
  //           }, 300);
  //         };
  //       })
  //       .catch((error) => {
  //         console.error("Error generating print content:", error);
  //       });
  //   }, 100);
  // }

  // onPrint() {
  //   const scale = 2; // Increase scale for better print quality
  //   html2canvas(document.body, { scale })
  //     .then((canvas) => {
  //       // Get the generated image from the canvas
  //       const img = canvas.toDataURL("image/png");

  //       // Create an iframe for printing
  //       const printFrame = document.createElement("iframe");
  //       printFrame.style.display = "none";
  //       document.body.appendChild(printFrame);

  //       // Get the iframe document for writing content
  //       const printDocument = printFrame.contentWindow.document;
  //       printDocument.open();
  //       printDocument.write(`
  //       <html>
  //         <head>
  //           <title>Print</title>
  //           <style>
  //             @media print {
  //               img {
  //                 width: 100%;
  //                 height: auto;
  //               }
  //               body {
  //                 margin: 0;
  //                 padding: 0;
  //               }
  //             }
  //           </style>
  //         </head>
  //         <body>
  //           <img src="${img}" style="width: 100%; height: auto;"/>
  //           <p>Disclaimer: This “Quick Quote Calculator“ is intended to give you some examples of different finance scenarios. The results are for illustrative purposes only and are not legally binding. The calculations are estimates and do not  constitute a loan application or an offer of finance from UDC Finance Limited (“UDC”) nor is it a recommendation or opinion in relation to the relevant products. You should make your own judgements and seek independent legal and financial advice before committing to any loan agreement.  To obtain finance from UDC you need to submit a formal application which will be processed subject to UDC's credit approval process and lending criteria.  UDC’s terms, conditions and fees apply to any loan. UDC accepts no responsibility for any losses arising from the use of or reliance upon any calculations or conclusions reached using the calculator.</p>
  //         </body>
  //       </html>
  //     `);
  //       printDocument.close();

  //       // Trigger the print action
  //       printFrame.onload = function () {
  //         printFrame.contentWindow.print();
  //         document.body.removeChild(printFrame); // Clean up the iframe
  //       };
  //     })
  //     .catch((error) => { });
  // }

  receiveMessage(val?: any, index?: number) {
    if (index < 2) {
      this.quickquoteService.quickQuote[index + 1].btnDisabled = val;
      this.cdr.detectChanges();
    }
  }

  formSubmitted(event, index) {
    this.quickquoteService.quickQuote[index + 1].btnDisabled = !event;
    //  this.receiveMessage(event,index)
  }

  btnClick(index: number) {
    this.quickquoteService.copyData(index);
  }

  hideCard(i: number) {
    this.quickQuote[i].form = false;
    this.quickquoteService;
    if (i == 1) {
      this.quickquoteService.quickQuote[i].btnDisabled = false;

      this.quickquoteService.quickQuote[i + 1].btnDisabled = true;
    } else if (i == 2 && this.quickquoteService.quickQuote.length > 1) {
      this.quickquoteService.quickQuote[i].btnDisabled = false;

      if (i == 2 && !this.quickquoteService.quickQuote[i - 1].form) {
        this.quickquoteService.quickQuote[i].btnDisabled = true;
      }
    } else {
      this.quickquoteService.quickQuote[i].btnDisabled = true;
    }

    // this.quickquoteService.quickQuote[i].btnDisabled = false;
  }
}
