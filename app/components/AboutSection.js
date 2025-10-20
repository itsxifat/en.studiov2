"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const teamMembers = [
    { id: 1, name: "Alex Chen", title: "Founder & Director", image: "https://placehold.co/600x800" },
    { id: 2, name: "Maria Garcia", title: "Lead Cinematographer", image: "https://placehold.co/600x800" },
];

const AboutSection = () => {
    const [activeMember, setActiveMember] = useState(teamMembers[0]);

    return (
        <section className="py-20 md:py-32 bg-black text-white" id="about">
            <div className="container mx-auto px-8">
                <h2 className="section-title text-center text-5xl md:text-7xl font-bold tracking-tight mb-16 font-heading uppercase">Our Studio Story</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative aspect-[3/4] overflow-hidden">
                        <AnimatePresence>
                            <motion.img
                                key={activeMember.id}
                                src={activeMember.image}
                                alt={activeMember.name} 
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full h-full object-cover"
                            />
                        </AnimatePresence>
                    </div>
                    <div>
                        <p className="text-xl text-cyan-400 italic mb-6 font-body">"We tell stories through light and movement."</p>
                        <p className="text-neutral-300 text-lg mb-8 font-body">
                            Founded in 2015, our studio was born from a passion for cinematic storytelling. We've grown into a collective of talented directors, cinematographers, and animators dedicated to pushing creative boundaries.
                        </p>
                        <div className="border-t-2 border-neutral-800 pt-8">
                            {teamMembers.map((member) => (
                                <div
                                    key={member.id}
                                    onMouseEnter={() => setActiveMember(member)}
                                    className="team-member-item py-4 border-b-2 border-neutral-800 flex justify-between items-center cursor-pointer transition-colors hover:bg-neutral-900/50"
                                >
                                    <h3 className="text-3xl font-heading font-bold">{member.name}</h3>
                                    <p className="text-neutral-500 font-body">{member.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
