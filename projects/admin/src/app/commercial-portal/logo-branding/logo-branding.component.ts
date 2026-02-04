import { Component, OnInit } from '@angular/core';

interface ThemeColor {
    label: string;
    value: string;
}

interface CarBrand {
    id: string;
    name: string;
    logos: BrandLogo[];
}

interface BrandLogo {
    id: string;
    name: string;
    image: string;
    fileName: string;
    brandId: string;
    brandName: string;
}

@Component({
    selector: 'app-commercial-logo-branding',
    templateUrl: './logo-branding.component.html',
    styleUrls: ['./logo-branding.component.scss']
})
export class CommercialLogoBrandingComponent implements OnInit {

    portalMainLogo: string | null = null;
    invertedLogo: string | null = null;
    faviconFile: string | null = null;
    
    browserTabName: string = 'Commercial Portal | UDC';

    // Car Brands
    carBrands: CarBrand[] = [
        { id: 'audi', name: 'Audi', logos: [] },
        { id: 'bmw', name: 'BMW', logos: [] },
        { id: 'mercedes', name: 'Mercedes-Benz', logos: [] },
        { id: 'toyota', name: 'Toyota', logos: [] },
        { id: 'honda', name: 'Honda', logos: [] },
        { id: 'hyundai', name: 'Hyundai', logos: [] },
        { id: 'ford', name: 'Ford', logos: [] },
        { id: 'volkswagen', name: 'Volkswagen', logos: [] }
    ];
    selectedBrandId: string = '';
    newBrandName: string = '';
    showAddBrandModal: boolean = false;
    
    // Pagination for logos
    logosDisplayLimit: number = 7; // Show 7 logos initially (2 rows)
    logosToShow: number = 7; // Current limit

    themeColors: ThemeColor[] = [
        { label: 'Primary Brand Color', value: '#1358EC' },
        { label: 'Secondary / Accent', value: '#111318' },
        { label: 'Success State', value: '#22C55E' },
        { label: 'Warning State', value: '#F59E0B' }
    ];

    fontFamilies: string[] = ['Manrope (Brand Default)', 'Inter', 'Roboto', 'Open Sans', 'Lato'];
    selectedFontFamily: string = 'Manrope (Brand Default)';
    
    baseFontSize: number = 16;
    fontSizeOptions = [
        { label: 'SM (8px)', value: 8 },
        { label: 'MD (16px)', value: 16 },
        { label: 'LG (24px)', value: 24 }
    ];

    constructor() { }

    ngOnInit(): void { }

    onMainLogoUpload(event: any): void {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.portalMainLogo = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    onInvertedLogoUpload(event: any): void {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.invertedLogo = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    onFaviconUpload(event: any): void {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.faviconFile = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    // Car Brand Methods
    addNewBrand(): void {
        if (this.newBrandName.trim()) {
            const newBrand: CarBrand = {
                id: this.generateId(),
                name: this.newBrandName.trim(),
                logos: []
            };
            this.carBrands.push(newBrand);
            this.newBrandName = '';
            this.showAddBrandModal = false;
            this.selectedBrandId = newBrand.id;
        }
    }

    removeBrand(brandId: string): void {
        this.carBrands = this.carBrands.filter(b => b.id !== brandId);
        if (this.selectedBrandId === brandId) {
            this.selectedBrandId = '';
        }
    }

    getSelectedBrand(): CarBrand | undefined {
        return this.carBrands.find(b => b.id === this.selectedBrandId);
    }

    onBrandLogoUpload(event: any): void {
        if (!this.selectedBrandId) {
            alert('Please select a brand first');
            return;
        }
        
        const brand = this.getSelectedBrand();
        if (!brand) return;

        const files = event.target.files;
        if (files) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    const newLogo: BrandLogo = {
                        id: this.generateId(),
                        name: file.name.split('.')[0],
                        image: e.target.result,
                        fileName: file.name,
                        brandId: brand.id,
                        brandName: brand.name
                    };
                    brand.logos.push(newLogo);
                };
                reader.readAsDataURL(file);
            }
        }
        event.target.value = '';
    }

    updateLogoName(logo: BrandLogo, newName: string): void {
        logo.name = newName;
    }

    removeLogo(logoId: string): void {
        const brand = this.carBrands.find(b => b.logos.some(l => l.id === logoId));
        if (brand) {
            brand.logos = brand.logos.filter(l => l.id !== logoId);
            // Reset display limit if we removed logos and now showing less than limit
            const totalLogos = this.getAllLogos().length;
            if (totalLogos < this.logosToShow) {
                this.logosToShow = Math.max(this.logosDisplayLimit, totalLogos);
            }
        }
    }

    getAllLogos(): BrandLogo[] {
        const allLogos: BrandLogo[] = [];
        this.carBrands.forEach(brand => {
            brand.logos.forEach(logo => {
                allLogos.push(logo);
            });
        });
        return allLogos;
    }

    getDisplayedLogos(): BrandLogo[] {
        const allLogos = this.getAllLogos();
        return allLogos.slice(0, this.logosToShow);
    }

    hasMoreLogos(): boolean {
        return this.getAllLogos().length > this.logosToShow;
    }

    showMoreLogos(): void {
        this.logosToShow += this.logosDisplayLimit;
    }

    getTotalLogosCount(): number {
        return this.carBrands.reduce((sum, brand) => sum + brand.logos.length, 0);
    }

    private generateId(): string {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    onColorChange(index: number, event: any): void {
        this.themeColors[index].value = event.target.value;
    }

    resetToDefault(): void {
        this.themeColors = [
            { label: 'Primary Brand Color', value: '#1358EC' },
            { label: 'Secondary / Accent', value: '#111318' },
            { label: 'Success State', value: '#22C55E' },
            { label: 'Warning State', value: '#F59E0B' }
        ];
        this.selectedFontFamily = 'Manrope (Brand Default)';
        this.baseFontSize = 16;
        this.carBrands.forEach(brand => brand.logos = []);
        this.selectedBrandId = '';
        this.logosToShow = this.logosDisplayLimit; // Reset pagination
        console.log('Reset to default');
    }

    saveChanges(): void {
        const settings = {
            portalMainLogo: this.portalMainLogo,
            invertedLogo: this.invertedLogo,
            faviconFile: this.faviconFile,
            browserTabName: this.browserTabName,
            carBrands: this.carBrands,
            themeColors: this.themeColors,
            selectedFontFamily: this.selectedFontFamily,
            baseFontSize: this.baseFontSize
        };
        console.log('Saving changes:', settings);
        // API call to save settings would go here
    }
}
