import React from "react";
import TypingCard from "@/components/TypingCard";
const About = () => {
  const cardContent = `
    <p>大家好，我是NeverMore的作者。</p>
  `;
  return (
    <div className="app-container">
      <TypingCard title="关于作者" source={cardContent} />
    </div>
  );
};

export default About;
