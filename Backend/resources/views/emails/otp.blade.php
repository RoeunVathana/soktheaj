<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your OTP Code</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f4f4f7;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 480px;
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
            margin-bottom: 16px;
        }
        .otp-box {
            background-color: #f0f4ff;
            border: 2px dashed #667eea;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
        }
        .otp-code {
            font-size: 36px;
            font-weight: 700;
            letter-spacing: 8px;
            color: #667eea;
            font-family: 'Courier New', monospace;
        }
        .note {
            color: #666;
            font-size: 14px;
            line-height: 1.6;
            margin-top: 16px;
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
            <h1>Verify Your Email</h1>
        </div>
        <div class="body-content">
            <p class="greeting">Hi <strong>{{ $userName }}</strong>,</p>
            <p class="greeting">Use the following OTP code to verify your email address. This code is valid for <strong>5 minutes</strong>.</p>
            
            <div class="otp-box">
                <div class="otp-code">{{ $otp }}</div>
            </div>

            <p class="note">
                If you didn't create an account with {{ config('app.name') }}, please ignore this email.
            </p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>