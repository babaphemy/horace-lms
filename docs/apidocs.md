# API Documentation

## User Management

### User Sign-up

### Reset Password

## Course Management

All requests require `INSTRUCTOR` role.

### Create course

Creates a new course.

#### Sample Request

user is the ID of the author.

```bash
curl -X 'POST' \
  'http://localhost:5071/api/v1/course/add' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '  {
      "user": "684e665d59f9a83e5140d977",
      "courseName": "Game Theory",
      "brief": "This is a great course on how to improve your game.",
      "overview": "<p>This course provides a decent introduction to game development.<p>",
      "thumbnail": "",
      "category": "web",
      "currency": "NGN",
      "draft": true,
      "cost": 40000
    }'
```

### Edit course

Edit an existing course.

#### Sample request:

```bash
curl -X 'POST' \
  '{basepath}/api/v1/course/add' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '  {
      "id": "684f2a07b73d5f7a3bdebd5a",
      "user": "684e665d59f9a83e5140d977",
      "courseName": "FIFA and Corruption",
      "brief": "This is a great documentary",
      "overview": "Welcome to this documentary on the blatant corruption at FIFA",
      "thumbnail": "https://essluploads.s3.amazonaws.com/logo/horace-logo.png",
      "category": "web",
      "currency": "NGN",
      "draft": false,
      "cost": 40000
    }'
```

**_Note_**: id is required, else the request will create a new course. user is required else the request will fail.

### Add Module to course

An instructor can add new module to a existing course.
CourseID is required.
**_Note_** orderIndex controls the arrangement/order of each module. cid is the course ID, the module will be attached to the ID provided.

#### Sample Request

```bash
curl -X 'POST' \
  'http://localhost:5071/api/v1/course/module' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "module": "History of FIFA",
  "description": "Who or what is FIFA? what do you need to know about FIFA",
  "orderIndex": 2,
  "cid": "684f2a07b73d5f7a3bdebd5a"
}'
```

### Edit Module

The create module request above can also be used to edit a request if ID is provided.
**_Note_** id and cid are not the same. ID is the module's ID while CID is the course ID.

#### Sample Request

```bash
curl -X 'POST' \
  '{basepath}/api/v1/course/module' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "module": "History of FIFA",
  "description": "Who or what is FIFA? what do you need to know about FIFA",
  "orderIndex": 2,
  "cid": "684f2a07b73d5f7a3bdebd5a"
}'
```

### Upload Asset

This endpoint should be used for all uploads.
Note that videos uploaded to this endpoint will be automatically encoded, optimized and compressed. Our encoding format is

### Add Lesson to module

This is the main deal.
A lesson can be video, file, html or audio.
**_Note_**
The field called video should only be used if the lesson type is video. This is a path to the uploaded video file. [This endpoint](#upload-asset) can be used to upload any/every asset.

Type filed can be any of the following:

- video
- document
- html
- pdf
- quiz
- text

tid is the module ID, this lesson will be attached to the module ID provided.
orderIndex controls the order of the lessons.

#### Sample Request - Video lesson

#### Sample Request - Other lesson

```bash
curl -X 'POST' \
  'http://localhost:5071/api/v1/course/module/lesson' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "title": "FIFA and Corruption",
  "content": "FIFA is ridden with corruption despite all the good things they have done for the big beautiful sport",
  "type": "text",
  "orderIndex": 2,
  "tid": "684f542d28f7ad4a06794fb8"
}'

```

### Delete course

### All organization's courses

Get all courses for an organization. This also include all courses created by every user in the selected organization. You must be an admin or instructor to use the endpoint.

#### Sample request:

```bash
curl -X 'GET' \
  '{basepath}/api/v1/course/org-courses?page=0&size=10&orgId={orgId}' \
  -H 'accept: */*'
```

### My Drafts

Fetches all draft courses created a by a user. A draft course is not published yet and users can not register or sign-up for the unpublished course.

### Sample Request

```bash
curl -X 'GET' \
  '{basepath}/api/v1/course/mydrafts/{userId}' \
  -H 'accept: */*'
```

### Course Registration

Registers a student/learner for a selected course.

### My Registered courses

All courses a user has registered for.

### Course by id

Fetches a single course with detailed information.

#### Sample Request

```bash
curl -X 'GET' \
  '{basepath}/api/v1/course/lms/684f2a07b73d5f7a3bdebd5a' \
  -H 'accept: */*'
```

### Courses by author

All courses created by the selected author.

#### Sample Request

```bash
curl -X 'GET' \
  '{basepath}/api/v1/course/byauthor/684e665d59f9a83e5140d977' \
  -H 'accept: */*'
```
