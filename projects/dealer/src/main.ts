import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { DealerModule } from "./app/dealer.module";
import { Router } from "@angular/router";

const isStandalone = !window.location.pathname.startsWith('/dealer');

platformBrowserDynamic()
  .bootstrapModule(DealerModule)
  .then(ref => {
    if (isStandalone) {
      const router = ref.injector.get(Router);
      router.navigate(['/home']);
    }
  });

