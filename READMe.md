README.md — Assignment 2 Cloud Deployment & Lambda Function Project Overview

This project demonstrates a cloud-deployed web application integrated with a serverless AWS Lambda function that dynamically generates HTML pages. It uses modern web technologies such as Next.js (v15) and AWS services including S3, Lambda, and API Gateway.

Cloud Deployment — AWS S3

The frontend (Next.js) application was built, exported, and deployed to an AWS S3 bucket configured for static website hosting.

Steps:

Ran the production build:

npm run build npm run export

Created an S3 bucket named s3cse3cwa-21519278-23-10-2025.

Enabled Static Website Hosting in S3 settings.

Set index document to index.html.

Attached a public access policy:

{ "Version": "2012-10-17", "Statement": [ { "Effect": "Allow", "Principal": "", "Action": "s3:GetObject", "Resource": "arn:aws:s3:::assi2-huynh-frontend/" } ] }

Uploaded the /out folder (from next export) to the S3 bucket.

Result:

The static website is accessible publicly at http://assi2-huynh-frontend.s3-website-ap-southeast-2.amazonaws.com

Serverless Lambda Function

A Node.js (v18) AWS Lambda function was created to dynamically generate and return an HTML page.

Function Name

generateDynamicPage

Code: export async function handler(event) { const name = event.queryStringParameters?.name || "Guest"; const color = event.queryStringParameters?.color || "steelblue";

const body = `

<title>Dynamic Lambda Page</title> <style> body { background-color: ${color}; font-family: Arial, sans-serif; color: white; text-align: center; padding: 50px; } h1 { font-size: 2.5em; margin-bottom: 0.5em; } p { font-size: 1.2em; } </style>
Welcome, ${name}!
This page was generated dynamically by AWS Lambda.

Time: ${new Date().toLocaleString()}

`;
return { statusCode: 200, headers: { "Content-Type": "text/html" }, body }; }

Description:

The Lambda function uses query parameters (name and color) to create dynamic HTML content with inline CSS styling and a timestamp.

Example URL: https://.execute-api.ap-southeast-2.amazonaws.com/default/generateDynamicPage?name=Huynh&color=royalblue

🔗 Integration (Optional Enhancement)

The Lambda endpoint can be linked directly from the S3 static website:

Try My Dynamic Lambda Page
This integration allows users to launch a serverless dynamic page directly from the static frontend.

Screenshots Included

S3 bucket configuration (Static website hosting)

Website running in browser (index.html)

Lambda console showing code

Lambda test result (“Welcome, Huynh!”)

Public API Gateway URL result (optional bonus)

Reflection

This project demonstrates:

Deployment of a Next.js application on AWS S3 for scalable, cost-effective hosting.

Use of AWS Lambda for serverless dynamic content generation.

Understanding of serverless architecture and event-driven web systems.

Together, these showcase modern full-stack cloud development practices.

Author: Leo Subject: Cloud Deployment & Serverless Computing (Assignment 2) Date: October 2025