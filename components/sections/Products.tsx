import { products } from "@/lib/brand";
import { Reveal } from "@/components/motion/Reveal";

export function Products() {
  return (
    <section className="relative px-6 py-28 md:py-36">
      <Reveal>
        <p className="font-display text-[11px] tracking-[0.32em] text-panko uppercase">
          Product
        </p>
      </Reveal>
      <ul className="mt-12 divide-y divide-panko/40 border-y border-panko/40">
        {products.map((product, i) => (
          <li key={product.name}>
            <Reveal delay={i * 0.06}>
              <a
                href={product.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-3 py-10 transition-colors md:flex-row md:items-end md:justify-between md:py-14"
              >
                <div>
                  <h2 className="type-grit font-display text-5xl font-extrabold tracking-[0.04em] text-rice uppercase md:text-6xl">
                    {product.name}
                  </h2>
                  <p className="mt-3 text-lg text-rice-dim">{product.line}</p>
                </div>
                <span className="font-mono text-[12px] tracking-[0.08em] text-panko group-hover:text-rice">
                  {product.href.replace(/^https?:\/\//, "")} →
                </span>
              </a>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
