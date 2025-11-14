import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    console.log("Seeding database with dummy data...")

    // Insert admin user
    await sql(`
      INSERT INTO users (email, password_hash, role, username, is_active)
      VALUES ('admin@fsl.com', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'admin', 'admin', true)
      ON CONFLICT DO NOTHING
    `)

    // Insert courses with YouTube video URLs
    const courses = [
      {
        title: "Vue.js Scratch Course",
        description:
          "Vue (pronounced /vjuː/, like view) is a progressive framework for building user interfaces. Unlike other monolithic frameworks, Vue is designed from the ground up to be incrementally adoptable. The core library is focused on the view layer only.",
        instructor_name: "Kihani Studio",
        instructor_image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
        price: 22.4,
        original_price: 30.13,
        discount_percentage: 20,
        category: "Frontend",
        image_url: "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400",
        video_url: "https://www.youtube.com/embed/FXpIoQ_rT_c",
        duration_hours: 21.33,
        total_lectures: 152,
        total_sections: 22,
        language: "English",
        total_students: 2300,
        is_featured: true,
      },
      {
        title: "The JavaScript Course",
        description:
          "JavaScript is a programming language commonly used in web development. It was originally developed for use within web browsers and is an essential part of most web applications.",
        instructor_name: "Adriana Hammontore",
        instructor_image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
        price: 24.99,
        original_price: 34.99,
        discount_percentage: 28,
        category: "Frontend",
        image_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400",
        video_url: "https://www.youtube.com/embed/W6NZfCO5tTE",
        duration_hours: 15.5,
        total_lectures: 120,
        total_sections: 18,
        language: "English",
        total_students: 4500,
        is_featured: true,
      },
      {
        title: "Mobile Development Masterclass",
        description:
          "Learn to build professional mobile applications for iOS and Android platforms. Master React Native and modern mobile development practices.",
        instructor_name: "Elena Rodriguez",
        instructor_image_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
        price: 24.99,
        original_price: 34.99,
        discount_percentage: 28,
        category: "Mobile",
        image_url: "https://images.unsplash.com/photo-1512941691920-25bda36dc643?w=400",
        video_url: "https://www.youtube.com/embed/0-S5a0eS84c",
        duration_hours: 18.75,
        total_lectures: 145,
        total_sections: 20,
        language: "English",
        total_students: 3200,
        is_featured: false,
      },
      {
        title: "Web Development Intensive",
        description:
          "Comprehensive course covering frontend and backend web development. Build full-stack applications with modern technologies.",
        instructor_name: "Marcus Johnson",
        instructor_image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
        price: 24.99,
        original_price: 34.99,
        discount_percentage: 28,
        category: "FullStack",
        image_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400",
        video_url: "https://www.youtube.com/embed/d-GZ3dNDnkE",
        duration_hours: 22.5,
        total_lectures: 180,
        total_sections: 25,
        language: "English",
        total_students: 5000,
        is_featured: true,
      },
      {
        title: "Design Thinking & Innovation",
        description:
          "Learn design thinking methodology and innovation strategies. Apply these concepts to solve real-world problems creatively.",
        instructor_name: "Ana Kursova",
        instructor_image_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
        price: 19.99,
        original_price: 29.99,
        discount_percentage: 33,
        category: "Design",
        image_url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400",
        video_url: "https://www.youtube.com/embed/r0p4qLLQw54",
        duration_hours: 12.0,
        total_lectures: 95,
        total_sections: 14,
        language: "English",
        total_students: 2100,
        is_featured: false,
      },
      {
        title: "Python for Beginners",
        description:
          "Start your programming journey with Python. Learn fundamentals and build real applications from scratch.",
        instructor_name: "David Chen",
        instructor_image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
        price: 17.99,
        original_price: 24.99,
        discount_percentage: 28,
        category: "Backend",
        image_url: "https://images.unsplash.com/photo-1526374965328-7f5f59e5b86d?w=400",
        video_url: "https://www.youtube.com/embed/mRMmGgJbBho",
        duration_hours: 16.5,
        total_lectures: 130,
        total_sections: 19,
        language: "English",
        total_students: 6200,
        is_featured: true,
      },
    ]

    for (const course of courses) {
      await sql(
        `INSERT INTO courses (
          title, description, instructor_name, instructor_image_url,
          price, original_price, discount_percentage, category,
          image_url, video_url, duration_hours, total_lectures,
          total_sections, language, total_students, is_featured, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, true)
        ON CONFLICT DO NOTHING`,
        [
          course.title,
          course.description,
          course.instructor_name,
          course.instructor_image_url,
          course.price,
          course.original_price,
          course.discount_percentage,
          course.category,
          course.image_url,
          course.video_url,
          course.duration_hours,
          course.total_lectures,
          course.total_sections,
          course.language,
          course.total_students,
          course.is_featured,
        ],
      )
    }

    // Insert sample reviews
    const reviews = [
      {
        course_id: 1,
        reviewer_name: "Leonardo Da Vinci",
        reviewer_email: "leonardo@example.com",
        rating: 5,
        comment: "Loved the course. I've learned very subtle techniques, especially on leaves.",
      },
      {
        course_id: 1,
        reviewer_name: "Titania S",
        reviewer_email: "titania@example.com",
        rating: 4,
        comment:
          "I loved the course, it had been a long time since I experimented with watercolors and now I will do it more often thanks to this.",
      },
      {
        course_id: 2,
        reviewer_name: "Zhirkov",
        reviewer_email: "zhirkov@example.com",
        rating: 5,
        comment:
          "Yes, I just emphasize that the use of Photoshop, for non-users, becomes difficult to follow. It requires to master it.",
      },
      {
        course_id: 2,
        reviewer_name: "Miphoska",
        reviewer_email: "miphoska@example.com",
        rating: 4,
        comment:
          "I haven't finished the course yet, as I would like to have some feedback from the teacher, about the comments I shared on the forum 3 months ago.",
      },
      {
        course_id: 3,
        reviewer_name: "Sarah Tech",
        reviewer_email: "sarah@example.com",
        rating: 5,
        comment: "Excellent course! The instructor explained everything clearly and the projects were very practical.",
      },
      {
        course_id: 3,
        reviewer_name: "John Developer",
        reviewer_email: "john@example.com",
        rating: 5,
        comment: "Best mobile development course I've taken. Highly recommended!",
      },
      {
        course_id: 4,
        reviewer_name: "Emma Designer",
        reviewer_email: "emma@example.com",
        rating: 4,
        comment: "Great comprehensive course covering all aspects of web development.",
      },
      {
        course_id: 5,
        reviewer_name: "Michael Creative",
        reviewer_email: "michael@example.com",
        rating: 5,
        comment: "Fascinating approach to design thinking. Very inspiring!",
      },
      {
        course_id: 6,
        reviewer_name: "Lisa Programmer",
        reviewer_email: "lisa@example.com",
        rating: 5,
        comment: "Perfect for beginners. Python concepts explained in a very simple way.",
      },
    ]

    for (const review of reviews) {
      await sql(
        `INSERT INTO reviews (course_id, reviewer_name, reviewer_email, rating, comment)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT DO NOTHING`,
        [review.course_id, review.reviewer_name, review.reviewer_email, review.rating, review.comment],
      )
    }

    return Response.json(
      {
        message: "Database seeded successfully!",
        courses_added: courses.length,
        reviews_added: reviews.length,
      },
      { status: 200, headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    console.error("Seeding error:", error)
    return Response.json(
      {
        error: "Failed to seed database",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}
