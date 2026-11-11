<?php

namespace Database\Seeders;

use App\Models\Message;
use Illuminate\Database\Seeder;

class MessageSeeder extends Seeder
{
    public function run(): void
    {
        $messages = [
            [
                'sender_name' => 'John Smith',
                'sender_email' => 'john.smith@example.com',
                'subject' => 'Project Collaboration Inquiry',
                'message' => 'Hi, I came across your portfolio and I am very impressed with your work. I would like to discuss a potential collaboration on a web development project. Please let me know if you are available for freelance work.',
                'is_read' => false,
            ],
            [
                'sender_name' => 'Sarah Johnson',
                'sender_email' => 'sarah.j@company.com',
                'subject' => 'Job Opportunity - Senior Developer',
                'message' => 'We are looking for a Senior Full Stack Developer to join our team at TechCorp. Your experience with Laravel and React aligns perfectly with what we need. Would you be interested in scheduling an interview?',
                'is_read' => false,
            ],
            [
                'sender_name' => 'Mike Chen',
                'sender_email' => 'mike.chen@startup.io',
                'subject' => 'Partnership Proposal',
                'message' => 'I am the founder of a tech startup and I am looking for a technical co-founder. Your skills in building full-stack applications would be invaluable. Let me know if you would like to discuss this opportunity.',
                'is_read' => true,
            ],
            [
                'sender_name' => 'Emily Davis',
                'sender_email' => 'emily.d@designstudio.com',
                'subject' => 'Website Redesign Project',
                'message' => 'We have a client who needs a complete website redesign. Our design team handles the UI/UX, and we need a skilled developer to bring it to life. Are you available for a 3-month contract starting next month?',
                'is_read' => false,
            ],
            [
                'sender_name' => 'David Wilson',
                'sender_email' => 'dwilson@university.edu',
                'subject' => 'Guest Lecture Invitation',
                'message' => 'I am a professor at the University of Technology and I would like to invite you to give a guest lecture on modern web development practices to our computer science students. The session would be about 2 hours.',
                'is_read' => true,
            ],
            [
                'sender_name' => 'Lisa Thompson',
                'sender_email' => 'lisa.t@consulting.com',
                'subject' => 'Technical Consultation Request',
                'message' => 'Our company is planning to migrate our legacy system to a modern tech stack. We need a consultant to help us plan the architecture and choose the right technologies. Are you available for a consultation?',
                'is_read' => false,
            ],
            [
                'sender_name' => 'Alex Rivera',
                'sender_email' => 'alex.r@agency.com',
                'subject' => 'Freelance Project - E-commerce Site',
                'message' => 'We have a client who wants to build a custom e-commerce platform. Budget is flexible and timeline is 4 months. Your previous e-commerce project looks exactly like what we need. Interested?',
                'is_read' => false,
            ],
            [
                'sender_name' => 'Rachel Kim',
                'sender_email' => 'rachel.kim@devcon.io',
                'subject' => 'Conference Speaker Invitation',
                'message' => 'We would like to invite you to speak at DevCon 2026 about your experience building scalable web applications. The conference will be held in Singapore this November. Travel and accommodation will be covered.',
                'is_read' => true,
            ],
            [
                'sender_name' => 'Tom Baker',
                'sender_email' => 'tom.b@technews.com',
                'subject' => 'Interview Request for Article',
                'message' => 'I am a tech journalist writing an article about the growing tech scene in Cambodia. I would love to interview you about your experience as a developer and your perspective on the local tech industry.',
                'is_read' => false,
            ],
            [
                'sender_name' => 'Nina Patel',
                'sender_email' => 'nina.p@coworking.com',
                'subject' => 'Tech Meetup Organization',
                'message' => 'We are organizing a monthly tech meetup at our co-working space and would love for you to give a talk or workshop. Topics like Laravel best practices or React patterns would be great for our community.',
                'is_read' => true,
            ],
        ];

        foreach ($messages as $msgData) {
            Message::create($msgData);
        }
    }
}