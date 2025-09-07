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
  const { questionId } = req.query;
  const user = authenticateToken(req);
  if (!user) {
    return res.status(401).json({ message: 'Authorization denied' });
  }

  switch (req.method) {
    case 'PUT':
      try {
        const { completed, forReview } = req.body;
        const question = await Question.findById(questionId);
        if (!question || question.userId.toString() !== user.user.id) {
            return res.status(404).json({ message: 'Question not found or not authorized' });
        }
        
        await Question.findByIdAndUpdate(questionId, { $set: { completed, forReview } });
        res.status(200).json({ message: 'Question updated' });

      } catch (error) {
        res.status(500).json({ message: 'Server Error' });
      }
      break;
    case 'DELETE':
      try {
        const question = await Question.findById(questionId);
        if (!question || question.userId.toString() !== user.user.id) {
          return res.status(404).json({ message: 'Question not found or not authorized' });
        }
        await Question.findByIdAndDelete(questionId);
        res.status(200).json({ message: 'Question deleted' });
      } catch (error) {
        res.status(500).json({ message: 'Server Error' });
      }
      break;
    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}