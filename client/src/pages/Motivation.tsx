import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Lightbulb, Target, Coffee, Book, Zap } from 'lucide-react';

const quotes = [
  {
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes",
    emoji: "🌱"
  },
  {
    text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
    author: "Malcolm X",
    emoji: "🎓"
  },
  {
    text: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier",
    emoji: "💪"
  },
  {
    text: "The beautiful thing about learning is that nobody can take it away from you.",
    author: "B.B. King",
    emoji: "✨"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    emoji: "⏰"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    emoji: "❤️"
  },
  {
    text: "Strive for progress, not perfection.",
    author: "Unknown",
    emoji: "🎯"
  },
  {
    text: "Every accomplishment starts with the decision to try.",
    author: "John F. Kennedy",
    emoji: "🚀"
  }
];

const studyTips = [
  {
    title: "Take Regular Breaks",
    description: "Use the Pomodoro technique: 25 minutes of focus, 5 minutes of rest. Your brain needs time to consolidate information!",
    icon: Coffee,
    emoji: "☕",
    color: "from-amber-500 to-orange-500"
  },
  {
    title: "Active Recall",
    description: "Test yourself instead of just re-reading. Close your notes and try to recall what you just learned. It's proven to boost retention by 50%!",
    icon: Lightbulb,
    emoji: "💡",
    color: "from-yellow-500 to-amber-500"
  },
  {
    title: "Create a Study Schedule",
    description: "Plan your study sessions in advance. Consistency beats cramming every time. Even 30 minutes daily is more effective than 5 hours once a week!",
    icon: Target,
    emoji: "📅",
    color: "from-blue-500 to-purple-500"
  },
  {
    title: "Teach Someone Else",
    description: "If you can explain a concept to someone else, you truly understand it. Find a study buddy or explain topics to yourself out loud!",
    icon: Book,
    emoji: "👥",
    color: "from-green-500 to-teal-500"
  },
  {
    title: "Stay Hydrated & Healthy",
    description: "Your brain is 73% water! Drink water, get enough sleep, and eat brain-boosting foods like nuts, berries, and fish.",
    icon: Zap,
    emoji: "💧",
    color: "from-cyan-500 to-blue-500"
  },
  {
    title: "Mix It Up",
    description: "Alternate between different subjects and topics. Interleaving (mixing topics) improves long-term retention better than blocking (one topic at a time).",
    icon: Sparkles,
    emoji: "🔄",
    color: "from-pink-500 to-rose-500"
  }
];

export default function Motivation() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const nextQuote = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
  };

  const quote = quotes[currentQuoteIndex];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent">
          Stay Motivated! ✨
        </h2>
        <p className="text-muted-foreground text-lg">
          Your daily dose of inspiration and study wisdom
        </p>
      </div>

      {/* Quote of the Day */}
      <Card className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-secondary/10 border-2" data-testid="card-quote">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <span className="text-3xl">{quote.emoji}</span>
            Quote of the Moment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <blockquote className="text-xl md:text-2xl font-medium italic text-center py-4" data-testid="text-quote">
            "{quote.text}"
          </blockquote>
          <p className="text-right text-muted-foreground font-semibold" data-testid="text-author">
            — {quote.author}
          </p>
          <div className="flex justify-center">
            <Button onClick={nextQuote} variant="outline" className="gap-2" data-testid="button-next-quote">
              <Sparkles className="w-4 h-4" />
              New Quote
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Study Tips */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          Study Tips & Techniques 🎯
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studyTips.map((tip, index) => (
            <Card
              key={index}
              className="border-l-4 transition-all hover:shadow-lg hover:scale-105"
              data-testid={`card-tip-${index}`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${tip.color}`}>
                    <tip.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span data-testid={`title-tip-${index}`}>{tip.title}</span>
                    <span className="text-2xl">{tip.emoji}</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground" data-testid={`description-tip-${index}`}>
                  {tip.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Motivational Reminders */}
      <Card className="bg-gradient-to-r from-green-500/10 to-teal-500/10" data-testid="card-reminders">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Target className="w-6 h-6" />
            Remember... 💫
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3" data-testid="reminder-1">
            <span className="text-2xl">🌟</span>
            <p className="text-lg">Small progress is still progress. Celebrate every step forward!</p>
          </div>
          <div className="flex items-start gap-3" data-testid="reminder-2">
            <span className="text-2xl">🧠</span>
            <p className="text-lg">Your brain is incredibly powerful. It can adapt and learn anything with practice.</p>
          </div>
          <div className="flex items-start gap-3" data-testid="reminder-3">
            <span className="text-2xl">🎉</span>
            <p className="text-lg">Mistakes are proof that you're trying. They're stepping stones to mastery!</p>
          </div>
          <div className="flex items-start gap-3" data-testid="reminder-4">
            <span className="text-2xl">💪</span>
            <p className="text-lg">You're capable of more than you think. Keep pushing your limits!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
