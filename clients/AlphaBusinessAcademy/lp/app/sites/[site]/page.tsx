import Hero from "../../components/sections/Hero";
import PainCards from "../../components/sections/PainCards";
import FAQ from "../../components/sections/FAQ";
import Footer from "../../components/layout/Footer";

export const runtime = 'edge';

export default function SitePage({ params }: { params: { site: string } }) {
    const { site } = params;

    return (
        <main>
            <div className="bg-[#D4A847] text-black text-center py-2 text-xs font-bold uppercase tracking-widest">
                Custom Site: {site}
            </div>
            <Hero />
            <PainCards />
            <FAQ />
            <Footer />
        </main>
    );
}
