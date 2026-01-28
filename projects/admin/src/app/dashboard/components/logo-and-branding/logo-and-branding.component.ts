import { Component, OnInit, ViewChild, ElementRef, Input } from "@angular/core";

@Component({
  selector: "app-logo-and-branding",
  templateUrl: "./logo-and-branding.component.html",
  styleUrls: ["./logo-and-branding.component.scss"],
})
export class LogoAndBrandingComponent implements OnInit {
  @ViewChild("companyFileInput")
  companyFileInput!: ElementRef<HTMLInputElement>;
  @ViewChild("brandFileInput") brandFileInput!: ElementRef<HTMLInputElement>;
  @Input() selectedTab: string = "quotesAndApps";
  logos: any = {
    company: {
      previewUrl: null,
      appliedLogo: null,
      selectedFile: null,
    },
    brand: {
      previewUrl: null,
      appliedLogo: null,
      selectedFile: null,
    },
  };

  brandOptions = [
    {
      label: "Brand 1",
      value: "brand1",
      icon: "assets/images/brands/brand1.png",
    },
    {
      label: "Brand 2",
      value: "brand2",
      icon: "assets/images/brands/brand2.png",
    },
    {
      label: "Brand 3",
      value: "brand3",
      icon: "assets/images/brands/brand3.png",
    },
  ];

  selectedBrand: string | null = null;

  // Font options
  fontOptions = [
    { label: "Area Inktrap", value: "Area Inktrap, sans-serif" },
    { label: "Arial", value: "Arial, sans-serif" },
    { label: "Helvetica", value: "Helvetica, sans-serif" },
    { label: "Times New Roman", value: "Times New Roman, serif" },
    { label: "Georgia", value: "Georgia, serif" },
    { label: "Verdana", value: "Verdana, sans-serif" },
    { label: "Courier New", value: "Courier New, monospace" },
    { label: "Trebuchet MS", value: "Trebuchet MS, sans-serif" },
    { label: "Impact", value: "Impact, sans-serif" },
  ];
  selectedFont: string = "Area Inktrap, sans-serif";

  // Color options
  themeColorOptions = [
    { label: "#0095DB", value: "#0095DB" },
    { label: "#007ACC", value: "#007ACC" },
    { label: "#00A3FF", value: "#00A3FF" },
    { label: "#0066CC", value: "#0066CC" },
  ];
  selectedThemeColor: string = "#0095DB";

  buttonColorOptions = [
    { label: "#02415F", value: "#02415F" },
    { label: "#003F5C", value: "#003F5C" },
    { label: "#004a66", value: "#004a66" },
    { label: "#00526e", value: "#00526e" },
  ];
  selectedButtonColor: string = "#02415F";

  ngOnInit(): void {
    // Load saved logos
    const savedCompany = localStorage.getItem("companyLogo");
    if (savedCompany) {
      this.logos.company.appliedLogo = savedCompany;
      this.logos.company.previewUrl = savedCompany;
    }

    const savedBrand = localStorage.getItem("brandLogo");
    if (savedBrand) {
      this.logos.brand.appliedLogo = savedBrand;
      this.logos.brand.previewUrl = savedBrand;
    }

    // Load font and color settings
    this.loadFontAndColorSettings();
  }

  onUploadClick(type: "company" | "brand"): void {
    if (type === "company") this.companyFileInput.nativeElement.click();
    else this.brandFileInput.nativeElement.click();
  }

  onFileSelected(event: any, type: "company" | "brand"): void {
    const file = event.target.files[0];
    if (file) {
      this.logos[type].selectedFile = file;
      this.displayPreview(file, type);
    }
    event.target.value = "";
  }

  onDrop(event: DragEvent, type: "company" | "brand"): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.logos[type].selectedFile = file;
      this.displayPreview(file, type);
    }
  }

  private displayPreview(file: File, type: "company" | "brand"): void {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/bmp",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Only JPG, PNG, GIF, and BMP are allowed.");
      return;
    }

    const maxSize = 200 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File size exceeds 200MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.logos[type].previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onApplyClick(type: "company" | "brand"): void {
    if (this.logos[type].previewUrl) {
      this.logos[type].appliedLogo = this.logos[type].previewUrl;
      localStorage.setItem(
        type === "company" ? "companyLogo" : "brandLogo",
        this.logos[type].previewUrl,
      );
      alert(
        `${type === "company" ? "Company" : "Brand"} logo applied successfully!`,
      );
    } else {
      alert("Please select a logo first.");
    }
  }

  clearLogo(type: "company" | "brand"): void {
    this.logos[type].previewUrl = null;
    this.logos[type].selectedFile = null;
    this.logos[type].appliedLogo = null;
    localStorage.removeItem(type === "company" ? "companyLogo" : "brandLogo");

    // Reset selected brand dropdown if clearing brand
    if (type === "brand") this.selectedBrand = null;
  }

  // Called when dropdown changes
  onBrandChange(event: any): void {
    const brand = this.brandOptions.find((b) => b.value === event.value);
    if (brand) {
      this.logos.brand.previewUrl = brand.icon;
      this.selectedBrand = brand.value;
    }
  }

  saveFontAndColor(): void {
    localStorage.setItem("selectedFont", this.selectedFont);
    localStorage.setItem("selectedThemeColor", this.selectedThemeColor);
    localStorage.setItem("selectedButtonColor", this.selectedButtonColor);
    alert("Font and color settings saved successfully!");
  }

  resetFontAndColor(): void {
    this.selectedFont = "Area Inktrap, sans-serif";
    this.selectedThemeColor = "#0095DB";
    this.selectedButtonColor = "#02415F";
    localStorage.removeItem("selectedFont");
    localStorage.removeItem("selectedThemeColor");
    localStorage.removeItem("selectedButtonColor");
  }

  loadFontAndColorSettings(): void {
    const savedFont = localStorage.getItem("selectedFont");
    const savedThemeColor = localStorage.getItem("selectedThemeColor");
    const savedButtonColor = localStorage.getItem("selectedButtonColor");

    if (savedFont) this.selectedFont = savedFont;
    if (savedThemeColor) this.selectedThemeColor = savedThemeColor;
    if (savedButtonColor) this.selectedButtonColor = savedButtonColor;
  }
}
