import { Star, Quote } from 'lucide-react'

interface Testimonial {
  name: string
  title: string
  company: string
  content: string
  rating: number
  image: string
}

const testimonials: Testimonial[] = [
  {
    name: 'John Smith',
    title: 'Professional Trader',
    company: 'Capital Trading LLC',
    content: 'The platform is incredibly intuitive and the execution speed is unmatched. I can manage multiple accounts seamlessly.',
    rating: 5,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john'
  },
  {
    name: 'Sarah Johnson',
    title: 'Portfolio Manager',
    company: 'Global Investments',
    content: 'Competitive pricing and access to global markets make this the best choice for institutional trading. Excellent support team.',
    rating: 5,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
  },
  {
    name: 'Michael Chen',
    title: 'Active Investor',
    company: 'Independent',
    content: 'Low commissions and powerful research tools help me make better decisions. Best trading platform I\'ve used.',
    rating: 5,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael'
  }
]

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-ibkr-light-blue to-white border-b-2 border-ibkr-gray-300">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-ibkr-navy mb-6">What Traders Say</h2>
          <p className="text-lg text-ibkr-gray-600 font-medium">Join thousands of professional traders worldwide</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="card-premium p-10 group hover:border-ibkr-blue hover:shadow-lg transition-all duration-300 relative">
              {/* Quote accent */}
              <div className="absolute top-4 right-4 text-ibkr-blue/20 group-hover:text-ibkr-blue/40 transition-colors duration-300">
                <Quote className="w-8 h-8" />
              </div>

              {/* Stars */}
              <div className="flex items-center space-x-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-ibkr-gray-700 mb-8 leading-relaxed font-medium italic">
                "{testimonial.content}"
              </p>

              {/* User info */}
              <div className="border-t-2 border-ibkr-gray-300 pt-6 flex items-center space-x-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full border-2 border-ibkr-blue/30 group-hover:border-ibkr-blue transition-colors duration-300"
                />
                <div>
                  <h4 className="font-bold text-ibkr-navy group-hover:text-ibkr-blue transition-colors duration-300">{testimonial.name}</h4>
                  <p className="text-sm text-ibkr-gray-600 font-semibold">{testimonial.title}</p>
                  <p className="text-xs text-ibkr-gray-500">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
