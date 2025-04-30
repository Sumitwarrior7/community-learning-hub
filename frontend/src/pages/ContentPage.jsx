// pages/ContentPage.jsx
import { useContentViewCredits } from '../hooks/useContentViewCredits';
import { CreditBalance } from '../components/CreditBalance';
import { PremiumContent } from '../components/PremiumContent';
import { TransactionHistory } from '../components/TransactionHistory';

const ContentPage = ({ content }) => {
  useContentViewCredits(content.id);

  return (
    <div className="container mx-auto p-4">
      <CreditBalance />
      <ContentPlayer content={content} />
      <PremiumContent contentId={content.id} price={content.premiumPrice} />
      <TransactionHistory />
    </div>
  );
};
