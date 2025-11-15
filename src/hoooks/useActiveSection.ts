import { useState, useEffect } from 'react';

const TranslatedSectionType: Record<string, string> = {
    "accueil": "Accueil",
    "a-propos": "À propos",
    "mes-experiences": "Mes expériences",
    "mes-projets": "Mes projets",
};

/**
 * Hook pour déterminer l'ID de la section visible sur base de l'Intersection Observer.
 * @param {string[]} sectionIds - Liste des IDs à observer (ex: ['home', 'about', 'projects'])
 * @param {number} threshold - La proportion de visibilité requise (ex: 0.5)
 */
const useActiveSection = (sectionIds: string[], threshold = 0.5) => {
    const [activeId, setActiveId] = useState<string>();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            {
                rootMargin: '0px 0px -50% 0px',
                threshold: threshold
            }
        );

        // Trouver et observer chaque élément par son ID
        sectionIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, [sectionIds, threshold]);


    return TranslatedSectionType[activeId || "Accueil"];
};

export default useActiveSection;