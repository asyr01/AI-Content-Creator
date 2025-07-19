import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'AI Content Creator - Trend-Based Content Generation',
  description: 'Generate high-quality, trend-based content for e-commerce businesses using AI and real-time market insights',
  keywords: 'AI content generation, trending content, e-commerce content, content drafting, content modification, image prompts',
};

export default Meta;
