"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"

interface Course {
  id: number
  title: string
  instructor_name: string
  price: number
  original_price: number
  discount_percentage: number
  image_url: string
  category: string
  total_students: number
  total_sections: number
  total_lectures: number
  duration_hours: number
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
  });

  useEffect(() => {
    fetchCourses()
    fetchSocialLinks()
  }, [])

  useEffect(() => {
    filterCourses()
  }, [searchTerm, selectedCategory, courses])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/courses")
      const data = await response.json()
      setCourses(data)
      setFilteredCourses(data)
    } catch (error) {
      console.error("Error fetching courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSocialLinks = async () => {
    try {
      const response = await fetch("/api/admin/settings")
      if (response.ok) {
        const data = await response.json()
        setSocialLinks(data)
      }
    } catch (error) {
      console.error("Error fetching social links:", error)
    }
  }

  const filterCourses = () => {
    let filtered = courses

    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.instructor_name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((course) => course.category === selectedCategory)
    }

    setFilteredCourses(filtered)
  }

  const categories = ["All", ...Array.from(new Set(courses.map((c) => c.category)))]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header Navigation */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-900">FSL Academy</h1>
          <div className="flex gap-2 flex-wrap justify-center">
            <Link href="/register">
              <Button variant="outline">Register</Button>
            </Link>
            <Link href="/admin/login">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white">Admin</Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section
        className="relative h-80 sm:h-96 md:h-[450px] lg:h-[500px] xl:h-[600px] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "url(https://images.pexels.com/photos/3059748/pexels-photo-3059748.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white px-4 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-balance">Learn something new everyday.</h1>
          <p className="text-lg sm:text-xl text-slate-100">Become professional and ready for the world.</p>
        </div>
      </section>

      {/* Search Section */}
      <section className="relative -mt-12 sm:-mt-16 px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-4 sm:p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Find courses, software, etc."
                  className="pl-10 py-6"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button className="bg-teal-500 hover:bg-teal-600 text-white py-6">Search</Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-2 flex-wrap justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-full font-medium transition whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-teal-500 text-white"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Courses Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Loading courses...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">No courses found. Try adjusting your search.</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-900 text-center">Browse Our Top Courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredCourses.map((course) => (
                <Link key={course.id} href={`/course/${course.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition cursor-pointer h-full flex flex-col">
                    <div className="h-32 sm:h-40 bg-cover bg-center" style={{ backgroundImage: `url(${course.image_url})` }} />
                    <div className="p-3 sm:p-4 flex-grow flex flex-col">
                      <div className="bg-teal-100 text-teal-700 text-xs font-semibold px-2 py-1 rounded w-fit mb-2">
                        {course.category}
                      </div>
                      <h3 className="font-bold text-sm mb-1 sm:mb-2 line-clamp-2 flex-grow">{course.title}</h3>
                      <p className="text-xs text-slate-600 mb-2 sm:mb-3">{course.instructor_name}</p>
                      <div className="flex items-center justify-between mb-2 sm:mb-3 text-xs text-slate-600">
                        <span>★ 4.5</span>
                        <span>({course.total_students})</span>
                      </div>
                      <div className="flex items-center gap-2 mt-auto">
                        <span className="text-base sm:text-lg font-bold text-slate-900">₦{Number(course.price).toFixed(2)}</span>
                        {course.original_price && (
                          <span className="text-xs sm:text-sm text-slate-400 line-through">
                            ₦{Number(course.original_price).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 sm:py-12 mt-8 sm:mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">WE LOOK FORWARD TO HAVING YOU ONBOARD</h2>
          <p className="text-lg sm:text-xl text-slate-400 mb-8">Get in touch and let Us Help In Your tech Journey</p>
          <p className="text-sm text-slate-500">© Fusionlink Solutions LTD</p>
          <div className="flex justify-center gap-4 mt-4 text-sm text-slate-500">
            <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-white">Terms of Service</Link>
            <Link href="/contact-us" className="hover:text-white">Contact Us</Link>
          </div>
          {socialLinks.facebook && (
            <div className="flex justify-center gap-4 mt-4">
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-500">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.776-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-400">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c1.105.214 2.247.322 3.404.322 3.676 0 7.166-1.407 9.792-3.617l.001-.002c.339-.314.339-.827 0-1.141-.339-.314-.89-.314-1.229 0l-.001.002c-2.39 2.08-5.68 3.205-9.07 3.205-1.058 0-2.09-.127-3.08-.374-.386-.096-.803.07-1.017.456-.214.386-.07.803.316.919zm1.757-1.172c.386.096.803-.07 1.017-.456.214-.386.07-.803-.316-.919-.386-.096-.803.07-1.017.456-.214.386-.07.803.316.919zM12 2C6.477 2 2 6.477 2 12c0 4.23 2.636 7.857 6.32 9.333.339.13.705.195 1.07.195.365 0 .731-.065 1.07-.195C17.364 19.857 20 16.23 20 12c0-5.523-4.477-10-10-10zm0 18c-3.39 0-6.58-1.31-8.98-3.51-.339-.314-.339-.827 0-1.141.339-.314.89-.314 1.229 0C7.42 17.69 10.61 19 14 19c3.39 0 6.58-1.31 8.98-3.51.339-.314.89-.314 1.229 0 .339.314.339.827 0 1.141C18.58 18.69 15.39 20 12 20z" />
                  </svg>
                </a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-white hover:text-pink-500">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.776-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-700">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.776-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>
      </footer>
    </div>
  )
}
