import React, { useEffect } from 'react';
import { useNavigationStore, pageToPath } from '../store/useNavigationStore';
import { useInventoryStore } from '../store/useInventoryStore';

export const SEOHead: React.FC = () => {
  const { activePage, selectedProduct, selectedOrder, editingProduct, selectedCategory, syncFromUrl } = useNavigationStore();
  const { products, orders } = useInventoryStore();

  // Listen to popstate (Browser Back / Forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      syncFromUrl(window.location.pathname, products, orders);
    };

    window.addEventListener('popstate', handlePopState);
    
    // Initial sync on mount
    syncFromUrl(window.location.pathname, products, orders);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [syncFromUrl, products, orders]);

  // Dynamic SEO Document Title & Meta Tag Updates (Google SEO Best Practices)
  useEffect(() => {
    let pageTitle = 'ShopAhora Panamá | Tienda Oficial de Comercio Electrónico';
    let metaDescription = 'Tienda en línea líder en Panamá. Venta de tecnología, hogar y accesorios con envíos garantizados a todo el país y facturación fiscal ITBMS (7%).';
    const canonicalUrl = `${window.location.origin}${pageToPath(activePage, selectedProduct, selectedOrder, editingProduct, selectedCategory)}`;

    switch (activePage) {
      case 'product-detail':
        if (selectedProduct) {
          pageTitle = `${selectedProduct.name} - $${selectedProduct.price} | ShopAhora Panamá`;
          metaDescription = `${selectedProduct.subtitle}. Comprar ${selectedProduct.name} con garantía de calidad y envío rápido a todas las provincias de Panamá.`;
        }
        break;

      case 'category':
        if (selectedCategory) {
          const categorySEO: Record<string, { title: string; desc: string }> = {
            audio: {
              title: 'Audio & Sonido HD Panamá | Audífonos y Bocinas Bluetooth - ShopAhora',
              desc: 'Explora nuestra colección de audio de alta fidelidad en Panamá. Audífonos canceladores de ruido, bocinas portátiles e integraciones de sonido con envío rápido.'
            },
            hogar: {
              title: 'Hogar & Confort Panamá | Humidificadores y Luces LED - ShopAhora',
              desc: 'Descubre accesorios de confort y ambiente para tu hogar en Panamá. Difusores de aroma, iluminación LED inteligente y dispositivos domésticos con garantía.'
            },
            tecnologia: {
              title: 'Tecnología & Gadgets Panamá | Smartwatches y Accesorios - ShopAhora',
              desc: 'Las últimas innovaciones tecnológicas y gadgets en Panamá. Relojes inteligentes, teclados mecánicos y soluciones de carga rápida con facturas fiscal DGI.'
            },
            accesorios: {
              title: 'Accesorios Premium & Estilo Panamá | Mochilas y Ergonomía - ShopAhora',
              desc: 'Accesorios personales y profesionales en Panamá. Mochilas ejecutivas anti-robo, soportes ergonómicos y gadgets para el día a día.'
            }
          };

          const info = categorySEO[selectedCategory.toLowerCase()] || {
            title: `Categoría ${selectedCategory.toUpperCase()} | ShopAhora Panamá`,
            desc: `Catálogo exclusivo de productos en la categoría ${selectedCategory} con envíos a las 10 provincias de Panamá y facturación ITBMS (7%).`
          };

          pageTitle = info.title;
          metaDescription = info.desc;
        }
        break;

      case 'cart':
        pageTitle = 'Carrito de Compras | ShopAhora Panamá';
        metaDescription = 'Revisa los productos seleccionados en tu carrito de compras, calcula el envío por provincia y obtén beneficios de envío gratis en Panamá.';
        break;

      case 'checkout':
        pageTitle = 'Finalizar Compra & Facturación ITBMS | ShopAhora Panamá';
        metaDescription = 'Proceso de pago seguro con facturación oficial DGI Panamá (7% ITBMS), selección de flota de despacho e integración de crédito B2B.';
        break;

      case 'presale':
        pageTitle = 'Generador de Preventa & Cotización B2B | ShopAhora Panamá';
        metaDescription = 'Herramienta para vendedores comerciales B2B. Generación de cotizaciones oficiales, pedidos a crédito y catálogo mayorista en Panamá.';
        break;

      case 'mermas':
        pageTitle = 'Registro de Mermas & Control de Bodega | ShopAhora Panamá';
        metaDescription = 'Módulo operativo de bodega y supervisión. Registro e inactivación de inventario defectuoso y trazabilidad de despacho.';
        break;

      case 'order-inspector':
        pageTitle = selectedOrder
          ? `Orden B2B #${selectedOrder.orderNumber} | ShopAhora Panamá`
          : 'Inspección de Orden de Compra | ShopAhora Panamá';
        metaDescription = 'Revisión y verificación de orden de compra B2B, desglose de ítems, flota asignada y trazabilidad de vendedor comercial.';
        break;

      case 'terms':
        pageTitle = 'Términos y Condiciones de Uso (Ley 51 & ACODECO) | ShopAhora Panamá';
        metaDescription = 'Términos comerciales oficiales regidos por la Ley N° 51 de Comercio Electrónico y Ley N° 45 de ACODECO en la República de Panamá.';
        break;

      case 'privacy':
        pageTitle = 'Política de Privacidad & Protección de Datos (Ley 81) | ShopAhora Panamá';
        metaDescription = 'Política de privacidad y derechos ARCO en cumplimiento de la Ley N° 81 de 2019 de Protección de Datos Personales en Panamá.';
        break;

      case 'shipping-policy':
        pageTitle = 'Políticas de Envío & Cobertura Nacional (10 Provincias) | ShopAhora Panamá';
        metaDescription = 'Matriz de logística nacional en Panamá. Tiempos de entrega por provincia, asignación de flota (moto, sedán, panel, camión 5T) y couriers.';
        break;

      case 'home':
      default:
        pageTitle = 'ShopAhora Panamá | E-Commerce Retail & Distribución Mayorista B2B';
        metaDescription = 'Catálogo exclusivo Retail y Portal Comercial B2B en Panamá. Envíos garantizados, facturación DGI y atención personalizada.';
        break;
    }

    // Update document title
    document.title = pageTitle;

    // Helper function to update or create meta tags
    const updateMetaTag = (nameAttr: string, valueAttr: string, content: string) => {
      let element = document.querySelector(`meta[${nameAttr}="${valueAttr}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, valueAttr);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update meta description
    updateMetaTag('name', 'description', metaDescription);

    // Update OpenGraph meta tags for social media preview & search crawlers
    updateMetaTag('property', 'og:title', pageTitle);
    updateMetaTag('property', 'og:description', metaDescription);
    updateMetaTag('property', 'og:url', canonicalUrl);
    updateMetaTag('property', 'og:type', activePage === 'product-detail' ? 'product' : 'website');

    if (activePage === 'product-detail' && selectedProduct?.images?.[0]) {
      updateMetaTag('property', 'og:image', selectedProduct.images[0]);
    }

    // Update Canonical URL link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

  }, [activePage, selectedProduct, selectedOrder, editingProduct, selectedCategory]);

  return null; // Side-effect component only
};
