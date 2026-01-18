
// MOCK BLOG DATA
// In a real app, this would be fetched from Firestore.

export const BLOG_POSTS = [
    {
        id: "anxiety-relax-myth",
        title: "Why 'Just Relax' Doesn't Work for Anxiety",
        author: "Dr. Aditi",
        authorRole: "Psychologist",
        authorBio: "Clinical Psychologist specializing in anxiety disorders and trauma-informed care.",
        type: "Psychologist",
        topic: "Anxiety",
        date: "Oct 24, 2025",
        readTime: "5 min",
        views: "1.2k",
        likes: 342,
        image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=800&q=80",
        excerpt: "Anxiety is a physiological state, not a choice. Here is the neuroscience behind why your brain ignores logic during panic.",
        content: `
            <p>Anxiety is often misunderstood as simply "worrying too much." But for those who experience it, it's a physiological storm. When someone says "just relax," they are appealing to your prefrontal cortex (logic), but your amygdala (fear center) has already hijacked the controls.</p>
            
            <h3>The Science of Safety</h3>
            <p>Your nervous system scans for safety 4 times every second. When it detects a threat—even a psychological one like an exam or a social interaction—it shifts into fight or flight. This isn't a glitch; it's an evolutionary survival mechanism designed to keep you safe from predators.</p>
            <p>The problem is, your brain can't distinguish between a saber-toothed tiger and a looming deadline. The physiological response—racing heart, shallow breathing, adrenaline dump—is exactly the same.</p>

            <blockquote>
                "To truly calm down, you don't need logic. You need biology."
            </blockquote>

            <p>Techniques like the physiological sigh (two inhales, one long exhale) work because they mechanically offload carbon dioxide and slow your heart rate. They speak the language of your nervous system.</p>

            <h3>3 Steps to Ground Yourself</h3>
            <ul>
                <li><strong>Physical Contact:</strong> Feel your feet on the floor. wiggle your toes. Remind your body it is here, now.</li>
                <li><strong>Visual Orientation:</strong> Look around and name 3 blue objects. This engages the orienting reflex and brings you out of internal panic.</li>
                <li><strong>Exhale Focus:</strong> Make your exhale longer than your inhale. This triggers the parasympathetic nervous system (rest and digest).</li>
            </ul>
            
            <p>Next time you feel the wave rising, don't try to "think" your way out of it. Breathe your way through it.</p>
        `
    },
    {
        id: "first-month-abroad",
        title: "Surviving Your First Month Abroad",
        author: "Lakshit",
        authorRole: "Peer",
        authorBio: "International student sharing experiences of adaptation and cultural shock.",
        type: "Peer",
        topic: "Student Life",
        date: "Oct 20, 2025",
        readTime: "4 min",
        views: "890",
        likes: 156,
        image: "https://images.unsplash.com/photo-1526772662000-3f88f107f5d8?auto=format&fit=crop&w=800&q=80",
        excerpt: "I thought I was ready. Then I landed in Berlin and the silence hit me. Here is how I navigated the loneliness of a new city.",
        content: `
            <p>The photos on Instagram showed coffee shops and landmarks. They didn't show the silence of my dorm room at 10 PM. Moving abroad is romanticized, but the reality is often a mix of adrenaline and deep isolation.</p>
            
            <h3>The Grocery Store Meltdown</h3>
            <p>I cried in a supermarket aisle because I couldn't find the right milk. It sounds funny now, but back then, it felt like proof that I wasn't cut out for this. The language barrier, the unfamiliar labels, the sheer newness of everything became overwhelming.</p>
            <p>If you are feeling this way: you are not weak. You are adjusting. Your brain is processing a million new inputs every day.</p>
            
            <h3>Finding Your Anchors</h3>
            <p>What saved me wasn't trying to fit in immediately. It was finding small anchors.</p>
            <ul>
                <li>A weekly video call home purely to gossip, not to update parents on grades.</li>
                <li>Finding a park bench that became "mine."</li>
                <li>Creating a playlist of songs that smelled like home.</li>
            </ul>
            <p>These small familiarities act as a bridge while you build your new life structure. It gets easier. Not all at once, but day by day.</p>
        `
    },
    {
        id: "academic-validation",
        title: "The Invisible Weight of Academic Validation",
        author: "Aarti",
        authorRole: "Peer",
        authorBio: "Engineering student and mental health advocate.",
        type: "Peer",
        topic: "Student Life",
        date: "Oct 15, 2025",
        readTime: "6 min",
        views: "2.1k",
        likes: 512,
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
        excerpt: "When your self-worth is tied to a grade sheet, every exam feels like a trial of your existence. Let's decouple worth from work.",
        content: `
            <p>In our culture, "Tulna" (comparison) starts early. Sharma ji ka beta got 98%, so why did you get 96%? These subtle comments build a scaffold where our self-worth is entirely supported by external achievements.</p>
            
            <h3>The Performance Trap</h3>
            <p>We start believing that we are only as good as our last result. If we fail a test, we don't just feel like we failed a task; we feel like <em>we</em> are failures. This distinction is crucial.</p>
            
            <blockquote>
                "You are not your grades. You are the person who learns from them."
            </blockquote>
            
            <h3>Decoupling Worth from Work</h3>
            <p>It's hard, but we have to start separating our intrinsic value from our output. You deserve rest even if you weren't productive today. You deserve love even if you didn't top the class.</p>
            <p>Start by celebrating effort, not just outcomes. Did you study honestly? Then be proud, regardless of the mark. The weight is heavy, but we don't have to carry it alone.</p>
        `
    },
    {
        id: "burnout-signs",
        title: "Signs of Burnout You Might Be Ignoring",
        author: "Dr. S. Mehta",
        authorRole: "Psychologist",
        authorBio: "Occupational health psychologist focused on workplace wellbeing.",
        type: "Psychologist",
        topic: "Anxiety",
        date: "Oct 10, 2025",
        readTime: "3 min",
        views: "1.5k",
        likes: 220,
        image: "https://images.unsplash.com/photo-1502472584811-0a2f2ca8eb0e?auto=format&fit=crop&w=800&q=80",
        excerpt: "Burnout isn't just being tired. It's a state of emotional detachment. Learn the subtle signs before you hit the wall.",
        content: `
            <p>We often think burnout looks like collapse. But usually, it looks like cynicism. It looks like checking your email and feeling a wave of dread. It looks like feeling "numb" instead of sad.</p>
            
            <h3>The 3 Dimensions of Burnout</h3>
            <ol>
                <li><strong>Exhaustion:</strong> Feeling drained, unable to cope, tired even after sleep.</li>
                <li><strong>Cynicism (Depersonalization):</strong> Feeling detached from your work or the people you help. Thinking "it doesn't matter anyway."</li>
                <li><strong>Inefficacy:</strong> Feeling like you can't accomplish anything, or that your work has no value.</li>
            </ol>
            
            <p>If you recognize these signs, stop pushing. "Pushing through" burnout is like driving on a flat tire; you're only destroying the rim. Rest is not a reward; it's a requirement.</p>
        `
    }
];

export function getPostById(id) {
    return BLOG_POSTS.find(post => post.id === id);
}

export function getAllPosts() {
    return BLOG_POSTS;
}
