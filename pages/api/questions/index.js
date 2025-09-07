import dbConnect from '@/lib/dbConnect';
import Question from '@/models/Question';
import jwt from 'jsonwebtoken';

const authenticateToken = (req) => {
  const token = req.headers['x-auth-token'];
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

export default async function handler(req, res) {
  await dbConnect();
  const user = authenticateToken(req);
  if (!user) {
    return res.status(401).json({ message: 'Authorization denied' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const questions = await Question.find({ userId: user.user.id }).sort({ createdAt: -1 });
        res.status(200).json(questions);
      } catch (error) {
        res.status(500).json({ message: 'Server Error' });
      }
      break;
    case 'POST':
      try {
        const { title, link } = req.body;
        const newQuestion = new Question({
          userId: user.user.id,
          title,
          link,
        });
        const question = await newQuestion.save();
        res.status(201).json(question);
      } catch (error) {
        res.status(500).json({ message: 'Server Error' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}