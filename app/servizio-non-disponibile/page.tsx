import Link from "next/link";
import { RiprovaAutomatica } from "@/components/RiprovaAutomatica";
import { Caption, Eyebrow } from "@/components/ui/Text";

/**
 * Dove si finisce quando l'app non riesce a parlare col backend o col database.
 *
 * Esiste per un motivo preciso: «qualcosa si è rotto» non distingue un bug del codice da un
 * servizio gratuito che si è addormentato, e le due cose si risolvono in modi opposti. Senza
 * questa schermata il sintomo era una griglia di giocatori vuota sul login — indistinguibile
 * da un'app che non parte.
 */
export default async function ServizioNonDisponibilePage({
  searchParams,
}: {
  searchParams: Promise<{ causa?: string }>;
}) {
  const { causa } = await searchParams;
  const dbSospeso = causa === "database";

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
      <section className="surface-raised rounded-2xl px-6 py-8">
        <Eyebrow className="text-led-red">
          {dbSospeso ? "Database in pausa" : "Server in avvio"}
        </Eyebrow>
        <h1 className="font-display mt-1 text-h1 leading-[0.95] text-bone">
          {dbSospeso ? (
            <>
              Il tabellone è <span className="text-amber">in pausa</span>
            </>
          ) : (
            <>
              Sto <span className="text-amber">accendendo</span> il server
            </>
          )}
        </h1>

        <div className="rod-divider -mx-6 mt-4 w-[calc(100%+3rem)]" />

        {dbSospeso ? (
          <>
            <p className="font-mono mt-4 text-body leading-relaxed text-bone-dim">
              Il database si mette in pausa da solo dopo{" "}
              <span className="text-bone">7 giorni</span>{" "}che nessuno apre
              l&apos;app: è una regola del piano gratuito, non un guasto. Le
              partite non si perdono — ma finché è sospeso l&apos;app non vede
              niente, e le liste restano vuote.
            </p>

            <div className="mt-5 border-t border-felt-line pt-4">
              <Eyebrow>Come riattivarlo</Eyebrow>
              <ol className="font-mono mt-2 space-y-1.5 text-caption text-bone-dim">
                <li>
                  1 · Apri <span className="text-bone">supabase.com/dashboard</span>
                </li>
                <li>2 · Scegli il progetto del calcio balilla</li>
                <li>
                  3 · Premi <span className="text-bone">Restore project</span>{" "}e aspetta un
                  paio di minuti
                </li>
              </ol>
            </div>
          </>
        ) : (
          <p className="font-mono mt-4 text-body leading-relaxed text-bone-dim">
            Il server va in letargo dopo{" "}
            <span className="text-bone">15 minuti</span>{" "}che nessuno lo usa,
            sempre per via del piano gratuito. Si sveglia da solo:{" "}
            <span className="text-bone">ci vuole circa un minuto</span>, e
            succede una volta sola. Non serve fare niente.
          </p>
        )}

        <RiprovaAutomatica />

        <Link
          href="/"
          className="font-mono mt-6 inline-block rounded-full bg-amber px-6 py-2.5 text-caption font-bold uppercase tracking-[0.18em] text-felt-950 transition-transform duration-[var(--dur-instant)] active:scale-[0.97]"
        >
          Riprova adesso
        </Link>

        <Caption className="mt-3">
          Se hai appena riattivato il database, il primo caricamento può ancora
          metterci qualche secondo.
        </Caption>
      </section>
    </main>
  );
}
