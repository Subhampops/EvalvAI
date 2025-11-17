import { Card, CardContent } from '@/components/ui/card'

export function Testimonials() {
  const testimonials = [
    {
      name: 'Vivek ',
      role: 'Developer',
      company: 'Freelancing',
      image: 'https://res.cloudinary.com/dacglrvc9/image/upload/c_crop,ar_1:1/v1763347907/vivek_phoojj.jpg',
      linkedin: 'https://www.linkedin.com/in/shrivi-14th052004',
      text: 'InterviewAI helped me crack interviews. The Query Bot saved me hours of research, and the mock tests were incredibly realistic.',
    },
    {
      name: 'Subham Bhattacharya',
      role: 'Developer',
      company: 'Freelancing',
      image: 'https://res.cloudinary.com/dacglrvc9/image/upload/c_crop,ar_1:1/v1763347645/professional-headshot-4_xqande.jpg',
      linkedin: 'www.linkedin.com/in/subham2409',
      text: 'The Resume Analyzer gave me actionable feedback that got my resume shortlisted. The Question Generator covered every topic I was tested on.',
    },
    {
      name: 'Chhavi Prabhat',
      role: 'Developer',
      company: 'Freelancing',
      image: 'https://res.cloudinary.com/dacglrvc9/image/upload/c_crop,ar_3:4/v1763350935/chavvi_m4kdbj.jpg',
      linkedin: 'https://www.linkedin.com/in/chhavi-prabhat-09bb93271/',
      text: 'From DSA to GD preparation, InterviewAI had everything. The AI analysis was spot-on and helped me improve my weak areas.',
    },
    {
      name: 'Akash Gupta',
      role: 'Developer',
      company: 'Freelancing',
      image: 'https://res.cloudinary.com/dacglrvc9/image/upload/c_crop,w_800,h_1067,ar_3:4/v1763348157/akash_ajt8l7.jpg',
      linkedin: 'https://www.linkedin.com/in/akash-gupta-8a1305256?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
      text: 'The mock test platform is a game-changer. I practiced multiple times and felt confident walking into my interviews.',
    },
  ]

  return (
    <section id="testimonials" className="py-24 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Success Stories from Our Users
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join 1000+ students who got placed at their dream companies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, idx) => (
            <Card key={idx} className="border border-border hover:border-primary transition">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{testimonial.name}</h3>
                    <p className="text-sm text-primary font-semibold">{testimonial.role}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                  </div>
                  <a
                    href={testimonial.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
                <p className="text-foreground italic">"{testimonial.text}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
