import { products } from "@/lib/brand";
import { Reveal } from "@/components/motion/Reveal";

export function Products() {
  return (
    <section className="relative px-6 py-32 md:py-48">
      <ul>
        {products.map((product, i) => (
          <li key={product.name} className="border-t border-hairline last:border-b">
            <Reveal delay={i * 0.05}>
              <a
                href={product.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-3 py-16 md:flex-row md:items-end md:justify-between md:py-20"
              >
                <div>
                  <h2 className="type-grit font-sans text-5xl font-extrabold tracking-[-0.03em] text-rice uppercase md:text-7xl">
                    {product.name}
                  </h2>
                  <p className="mt-4 text-lg text-rice-dim">{product.line}</p>
                </div>
                <span className="text-sm tracking-[0.04em] text-panko group-hover:text-panko-hot">
                  {product.href.replace(/^https?:\/\//, "")}
                </span>
              </a>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
