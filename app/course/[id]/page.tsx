"use client"

import { useState, useEffect, use } from "react"
import { Heart, Play, BookOpen, Clock, Languages } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa" // Import WhatsApp icon
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

interface Course {
  id: number
  title: string
  description: string
  instructor_name: string
  instructor_image_url: string
  price: number
  original_price: number
  discount_percentage: number
  image_url: string
  video_url: string
  total_sections: number
  total_lectures: number
  duration_hours: number
  language: string
}

interface Review {
  id: number
  reviewer_name: string
  reviewer_avatar_url: string
  rating: number
  comment: string
}

export default function CourseDetail({ params: awaitedParams }: { params: Promise<{ id: string }> }) {
  const params = use(awaitedParams);
  const [course, setCourse] = useState<Course | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showEnrollDetails, setShowEnrollDetails] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    bank_name: "",
    account_number: "",
    transfer_instructions: "",
    whatsapp_number: "",
    whatsapp_enabled: false,
  });

  useEffect(() => {
    const fetchCourseAndReviews = async () => {
      if (!params.id) {
        setError("Course ID is missing.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true)
        setError(null)
        const [courseRes, reviewsRes] = await Promise.all([
          fetch(`/api/courses/${params.id}`),
          fetch(`/api/reviews/${params.id}`),
        ])

        if (courseRes.ok) {
          const courseData = await courseRes.json()
          setCourse(courseData)
        } else {
          setError("Course not found. Please try again later.")
        }

        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json()
          setReviews(reviewsData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Server error. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    const fetchBankDetails = async () => {
      try {
        const response = await fetch("/api/admin/settings");
        if (response.ok) {
          const data = await response.json();
          setBankDetails({
            bank_name: data.bank_name || "",
            account_number: data.account_number || "",
            transfer_instructions: data.transfer_instructions || "",
            whatsapp_number: data.whatsapp_number || "",
            whatsapp_enabled: data.whatsapp_enabled || false,
          });
        }
      } catch (error) {
        console.error("Error fetching bank details:", error);
      }
    };

    fetchCourseAndReviews();
    fetchBankDetails();
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Loading course...</p>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error || "Course not found."}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-slate-900 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-start items-center">
          <Link href="/" className="hover:opacity-80">
            ← Back
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="relative w-full rounded-lg overflow-hidden mb-8">
              {course.video_url && course.video_url.includes("youtube.com/embed") ? (
                <iframe
                  width="100%"
                  height="400"
                  src={course.video_url}
                  title={course.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                />
              ) : (
                <div
                  className="relative w-full bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center"
                  style={{
                    backgroundImage: `url(${course.image_url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-black/30" />
                  <button className="relative bg-white text-black rounded-full p-4 hover:bg-slate-100 transition">
                    <Play className="w-8 h-8 fill-current" />
                  </button>
                </div>
              )}
            </div>

            {/* Course Title */}
            <h1 className="text-4xl font-bold mb-4 text-slate-900">{course.title}</h1>

            {/* Instructor */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b">
              <img
                src={course.instructor_image_url || "/placeholder.svg"}
                alt={course.instructor_name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-slate-900">{course.instructor_name}</p>
                <p className="text-sm text-slate-600">Instructor</p>
              </div>
            </div>

            {/* About Course */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-slate-900">About Course</h2>
              <p className="text-slate-700 leading-relaxed">{course.description}</p>
            </div>

            {/* Course Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <Card className="p-4 text-center">
                <div className="flex justify-center mb-2">
                  <BookOpen className="w-6 h-6 text-yellow-500" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{course.total_sections}</p>
                <p className="text-sm text-slate-600">Sections</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="flex justify-center mb-2">
                  <Play className="w-6 h-6 text-yellow-500" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{course.total_lectures}</p>
                <p className="text-sm text-slate-600">Lectures</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="flex justify-center mb-2">
                  <Clock className="w-6 h-6 text-yellow-500" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{course.duration_hours}h</p>
                <p className="text-sm text-slate-600">Duration</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="flex justify-center mb-2">
                  <Languages className="w-6 h-6 text-yellow-500" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{course.language}</p>
                <p className="text-sm text-slate-600">Language</p>
              </Card>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-slate-900">Reviews</h2>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id} className="p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={review.reviewer_avatar_url || "/placeholder.svg"}
                        alt={review.reviewer_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-slate-900">{review.reviewer_name}</h3>
                          <span className="text-yellow-600 font-semibold">{"★".repeat(review.rating)}</span>
                        </div>
                        <p className="text-slate-700 mt-2">{review.comment}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-slate-900">₦{Number(course.price).toFixed(2)}</span>
                  {course.original_price && (
                    <span className="text-lg text-slate-400 line-through">₦{Number(course.original_price).toFixed(2)}</span>
                  )}
                </div>
                {course.discount_percentage > 0 && (
                  <div className="bg-red-100 text-red-700 text-sm font-semibold px-3 py-1 rounded w-fit">
                    {course.discount_percentage}% OFF
                  </div>
                )}
              </div>

              <Button
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 mb-3"
                onClick={() => setShowEnrollDetails(!showEnrollDetails)}
              >
                Enroll Now
              </Button>

              {showEnrollDetails && (
                <Card className="p-4 mt-4 bg-slate-50">
                  <h3 className="text-lg font-bold mb-2 text-slate-900">Account Details for Transfer</h3>
                  <p className="text-sm text-slate-700 mb-1">
                    <span className="font-semibold">Bank Name:</span> {bankDetails.bank_name || "N/A"}
                  </p>
                  <p className="text-sm text-slate-700 mb-3">
                    <span className="font-semibold">Account Number:</span> {bankDetails.account_number || "N/A"}
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    <span className="font-semibold">Instructions:</span> {bankDetails.transfer_instructions || "N/A"}
                  </p>
                </Card>
              )}

              {bankDetails.whatsapp_enabled && bankDetails.whatsapp_number && (
                <a
                  href={`https://wa.me/${bankDetails.whatsapp_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-3"
                >
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 flex items-center justify-center gap-2">
                    <FaWhatsapp className="w-5 h-5" />
                    Chat on WhatsApp
                  </Button>
                </a>
              )}


              <div className="mt-6 pt-6 border-t space-y-3">
                <div>
                  <p className="text-sm text-slate-600">Sections</p>
                  <p className="font-semibold text-slate-900">{course.total_sections}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Lectures</p>
                  <p className="font-semibold text-slate-900">{course.total_lectures}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total Duration</p>
                  <p className="font-semibold text-slate-900">{course.duration_hours}h 33m</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
