import React from 'react';
import { motion } from 'framer-motion';
import { MOCK_ARTICLES } from '@shared/mock-data';
import { Calendar } from 'lucide-react';
export function CulturePage() {
  return (
    <div className="bg-dao-paper py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl mb-20">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-dao-jade mb-6">The Path of <span className="text-dao-gold italic">Wisdom</span></h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            A sanctuary for exploration into Taoist philosophy, cultural practices, and the timeless search for balance in an ever-changing world.
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {MOCK_ARTICLES.map((article, idx) => (
            <motion.article 
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col group"
            >
              <div className="aspect-[16/10] overflow-hidden mb-6 rounded-sm shadow-soft">
                <img 
                  src={article.imageUrl} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-dao-gold uppercase tracking-widest mb-3">
                <Calendar className="w-3 h-3" /> {article.date}
              </div>
              <h2 className="text-2xl font-display font-bold text-dao-jade mb-4 group-hover:text-dao-gold transition-colors">
                {article.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">
                {article.excerpt}
              </p>
              <button className="text-dao-jade font-bold text-sm border-b-2 border-dao-jade/10 pb-1 w-fit group-hover:border-dao-gold transition-colors">
                Read Article
              </button>
            </motion.article>
          ))}
        </div>
        <section className="mt-32 p-12 md:p-20 bg-dao-jade text-dao-paper rounded-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-dao-gold/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-display font-bold mb-6 italic text-dao-gold">
              "When you are content to be simply yourself and don't compare or compete, everyone will respect you."
            </h3>
            <p className="text-dao-paper/60 uppercase tracking-[0.2em] text-xs font-bold">— Lao Tzu</p>
          </div>
        </section>
      </div>
    </div>
  );
}