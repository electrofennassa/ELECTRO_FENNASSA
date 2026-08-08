import React from 'react';
import { useApp } from '../context/AppContext';
import { COMPANY_INFO } from '../data/companyInfo';
import { Truck, ShieldCheck, FileText, Lock, RotateCcw } from 'lucide-react';

export const InfoPages: React.FC<{ type: 'delivery' | 'warranty' | 'terms' | 'privacy' | 'returns' }> = ({
  type,
}) => {
  const { lang, t } = useApp();

  if (type === 'delivery') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-16">
        <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl space-y-2">
          <span className="text-xs font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-full uppercase">
            TAOURIRT UNIQUEMENT
          </span>
          <h1 className="text-2xl sm:text-4xl font-black">Conditions de Livraison à Taourirt</h1>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h3 className="font-bold text-slate-900 text-base">Zone de livraison</h3>
          <p>
            ELECTRO_FENNASSA assure la livraison à domicile <strong>exclusivement sur la ville de Taourirt</strong> (quartiers Hay Jdid, Moulay Ali Cherif, Hay Nahda, Centre-ville, etc.).
          </p>

          <h3 className="font-bold text-slate-900 text-base pt-2">Délais & Modalités</h3>
          <p>
            Les livraisons sont effectuées sous 24h à 48h ouvrées. Notre livreur prend contact par téléphone avant son passage à votre adresse.
          </p>

          <h3 className="font-bold text-slate-900 text-base pt-2">Vérification & Paiement</h3>
          <p>
            Le paiement s effectue <strong>en espèces à la livraison (Paiement à la livraison)</strong>. Vous disposez de la possibilité de vérifier l état extérieur du colis et de l appareil en présence du livreur.
          </p>
        </div>
      </div>
    );
  }

  if (type === 'warranty') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-16">
        <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl space-y-2">
          <span className="text-xs font-bold text-blue-400 bg-blue-950 border border-blue-800 px-3 py-1 rounded-full uppercase">
            GARANTIE CONSTRUCTEUR & MAGASIN
          </span>
          <h1 className="text-2xl sm:text-4xl font-black">Garantie & Service Après-Vente</h1>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h3 className="font-bold text-slate-900 text-base">Durée de garantie</h3>
          <p>
            Tous nos produits gros et petit électroménager vendus chez ELECTRO_FENNASSA sont accompagnés d une <strong>garantie officielle allant de 1 an à 3 ans</strong> selon les marques et catégories.
          </p>

          <h3 className="font-bold text-slate-900 text-base pt-2">Prise en charge SAV à Taourirt</h3>
          <p>
            En cas de besoin de réparation ou de dysfonctionnement pendant la période de garantie, notre magasin situé à BD LA RÉSISTANCE HAY JDID à Taourirt vous accueille pour la prise en charge rapide de votre appareil auprès des centres techniques agréés.
          </p>
        </div>
      </div>
    );
  }

  if (type === 'returns') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-16">
        <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl space-y-2">
          <h1 className="text-2xl sm:text-4xl font-black">Politique de Retour et d Échange</h1>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            Si un appareil présente un défaut de fabrication dès sa déballe, vous disposez d un délai de 7 jours après réception pour contacter le magasin ELECTRO_FENNASSA au 06 65 65 73 10 afin d effectuer un échange ou une vérification technique.
          </p>
          <p>
            L appareil doit être restitué dans son emballage d origine avec l ensemble de ses accessoires et le bon de livraison / facture.
          </p>
        </div>
      </div>
    );
  }

  // Legal fallback (terms / privacy)
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl space-y-2">
        <h1 className="text-2xl sm:text-4xl font-black">
          {type === 'terms' ? 'Conditions Générales de Vente' : 'Politique de Confidentialité'}
        </h1>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <p>
          Le présent site web est édité par l entreprise <strong>ELECTRO_FENNASSA</strong>, située à BD LA RÉSISTANCE HAY JDID, Taourirt, Maroc.
        </p>
        <p>
          Les informations personnelles collectées lors du passage de votre commande (nom, téléphone, adresse à Taourirt) sont uniquement utilisées pour l acheminement de vos appareils et la confirmation de votre commande. Elles ne sont en aucun cas transmises à des tiers.
        </p>
      </div>
    </div>
  );
};
