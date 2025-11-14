import { sql } from "@/lib/db";
import crypto from "crypto"

function hashPassword(password: string): string {
  return crypto
    .createHash("sha256")
    .update(password + "FSL_SECRET")
    .digest("hex")
}

export async function POST() {
  try {
    // Insert sample courses if they don't exist
    const courses = [
      {
        title: "UI Design Masterclass",
        description: "Learn professional UI design from scratch with industry experts",
        instructor_name: "Adela Hummers",
        instructor_image_url: "/placeholder.svg?height=300&width=200",
        price: 24.99,
        original_price: 79.99,
        discount_percentage: 20,
        category: "Design",
        image_url: "/abstract-ui-elements.png",
        video_url: "",
        duration_hours: 12.5,
        total_lectures: 85,
        total_sections: 22,
        language: "English",
      },
      {
        title: "JavaScript Mastery",
        description: "Complete JavaScript course for beginners to advanced developers",
        instructor_name: "Adrian Humm",
        instructor_image_url: "/placeholder.svg?height=300&width=200",
        price: 22.4,
        original_price: 30.13,
        discount_percentage: 20,
        category: "Development",
        image_url: "/javascript-code.png",
        video_url: "",
        duration_hours: 15,
        total_lectures: 152,
        total_sections: 15,
        language: "English",
      },
      {
        title: "React Native Mobile Development",
        description: "Build powerful mobile apps with React Native",
        instructor_name: "Ava Humm",
        instructor_image_url: "/placeholder.svg?height=300&width=200",
        price: 23.09,
        original_price: 26.99,
        discount_percentage: 20,
        category: "Mobile",
        image_url: "/mobile-app-showcase.png",
        video_url: "",
        duration_hours: 14,
        total_lectures: 138,
        total_sections: 18,
        language: "English",
      },
      {
        title: "Full Stack Web Development",
        description: "Complete guide to modern full stack development",
        instructor_name: "Adrian Website",
        instructor_image_url: "/placeholder.svg?height=300&width=200",
        price: 24.99,
        original_price: 25.99,
        discount_percentage: 20,
        category: "Development",
        image_url: "/web-development-concept.png",
        video_url: "",
        duration_hours: 16.5,
        total_lectures: 176,
        total_sections: 20,
        language: "English",
      },
      {
        title: "Design Thinking & Innovation",
        description: "Masterclass in design thinking and innovation strategy",
        instructor_name: "Ana Kursova",
        instructor_image_url: "/placeholder.svg?height=300&width=200",
        price: 25.92,
        original_price: 30.99,
        discount_percentage: 15,
        category: "Design",
        image_url: "/design-thinking-concept.png",
        video_url: "",
        duration_hours: 20,
        total_lectures: 200,
        total_sections: 25,
        language: "English",
      },
      {
        title: "Web Frameworks Fundamentals",
        description: "Learn modern web frameworks and best practices",
        instructor_name: "Web Master",
        instructor_image_url: "/placeholder.svg?height=300&width=200",
        price: 22.12,
        original_price: 24.99,
        discount_percentage: 12,
        category: "Development",
        image_url: "/web-frameworks.jpg",
        video_url: "",
        duration_hours: 18,
        total_lectures: 165,
        total_sections: 22,
        language: "English",
      },
    ]

    for (const course of courses) {
      await sql`INSERT INTO courses (
          title, description, instructor_name, instructor_image_url,
          price, original_price, discount_percentage, category,
          image_url, video_url, duration_hours, total_lectures,
          total_sections, language, is_active
        ) VALUES (${course.title}, ${course.description}, ${course.instructor_name}, ${course.instructor_image_url}, ${course.price}, ${course.original_price}, ${course.discount_percentage}, ${course.category}, ${course.image_url}, ${course.video_url}, ${course.duration_hours}, ${course.total_lectures}, ${course.total_sections}, ${course.language}, true)
        ON CONFLICT (title) DO NOTHING`
    }

    // Insert sample reviews
    const reviews = [
      {
        course_title: "UI Design Masterclass",
        reviewer_name: "Leonardo Da Vinci",
        reviewer_avatar_url: "/placeholder.svg?height=48&width=48",
        rating: 5,
        comment: "Loved the course. I've learned very subtle techniques, especially on leaves.",
      },
      {
        course_title: "JavaScript Mastery",
        reviewer_name: "Titania S",
        reviewer_avatar_url: "/placeholder.svg?height=48&width=48",
        rating: 5,
        comment:
          "I loved the course, it had been a long time since I experimented with watercolors and now I will do it more often thanks to this course.",
      },
      {
        course_title: "React Native Mobile Development",
        reviewer_name: "Zhirkov",
        reviewer_avatar_url: "/placeholder.svg?height=48&width=48",
        rating: 5,
        comment:
          "Yes, I just emphasize that the use of Photoshop, for non-users, becomes difficult to follow. It requires to master it.",
      },
    ]

    for (const review of reviews) {
      const courses_result = await sql`SELECT id FROM courses WHERE title = ${review.course_title}`
      if (courses_result.length > 0) {
        await sql`INSERT INTO reviews (
            course_id, reviewer_name, reviewer_avatar_url, rating, comment
          ) VALUES (${courses_result[0].id}, ${review.reviewer_name}, ${review.reviewer_avatar_url}, ${review.rating}, ${review.comment})`
      }
    }

    return Response.json({ message: "Demo data seeded successfully!" })
  } catch (error) {
    console.error("Seed error:", error)
    return Response.json({ error: "Failed to seed data", details: String(error) }, { status: 500 })
  }
}
