<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Message</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f4f4f7;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 32px 24px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .body-content {
            padding: 32px 24px;
        }
        .greeting {
            color: #333;
            font-size: 16px;
            margin-bottom: 20px;
        }
        .details-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .details-table td {
            padding: 10px 12px;
            border-bottom: 1px solid #e8e8ef;
            vertical-align: top;
        }
        .details-table td:first-child {
            font-weight: 600;
            color: #555;
            width: 120px;
        }
        .details-table td:last-child {
            color: #333;
        }
        .message-box {
            background-color: #f8f9ff;
            border-left: 4px solid #667eea;
            border-radius: 8px;
            padding: 16px 20px;
            margin: 16px 0;
            line-height: 1.6;
            color: #444;
        }
        .footer {
            padding: 24px;
            text-align: center;
            border-top: 1px solid #e8e8ef;
        }
        .footer p {
            color: #999;
            font-size: 12px;
            margin: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Contact Message</h1>
        </div>
        <div class="body-content">
            <p class="greeting">Hello Admin,</p>
            <p class="greeting">You have received a new contact message from <strong>{{ $message->sender_name }}</strong>.</p>

            <table class="details-table">
                <tr>
                    <td>Name</td>
                    <td>{{ $message->sender_name }}</td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td>{{ $message->sender_email }}</td>
                </tr>
                @if($message->phone)
                <tr>
                    <td>Phone</td>
                    <td>{{ $message->phone }}</td>
                </tr>
                @endif
                <tr>
                    <td>Subject</td>
                    <td>{{ $message->subject ?? 'N/A' }}</td>
                </tr>
                <tr>
                    <td>User ID</td>
                    <td>{{ $message->user_id ?? 'N/A' }}</td>
                </tr>
                <tr>
                    <td>Date & Time</td>
                    <td>{{ $message->created_at->format('F j, Y g:i A') }}</td>
                </tr>
            </table>

            <h3 style="color: #555; margin-bottom: 8px;">Message:</h3>
            <div class="message-box">
                {{ $message->message }}
            </div>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>