import StudentModel from "../model/student.schema.js";
import Counter from "../model/counterID.schema.js"; 
import bcrypt from 'bcrypt';

const studentController = {
    getListStudent: async (req, res) => {
        try {
            const students = await StudentModel.find();
            res.status(200).send(students);
        } catch (error) {
            res.status(500).send({
                message: error.message
            });
        }
    },

    register: async (req, res) => {
            const { email, password, studentName } = req.body;
            // Mã hóa mật khẩu
            const hashedPassword = bcrypt.hashSync(password, 10);

            // Tìm và tăng giá trị seq cho 'studentID'
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'studentID' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );

            // Định dạng studentID theo dạng #00001, #00002,...
            const formattedID = `#${String(counter.seq).padStart(5, '0')}`;

            // Tạo student mới với studentID tự động tăng
            const createStudent = await StudentModel.create({
                studentName,
                email,
                password: hashedPassword,
                studentID: formattedID // Gán studentID đã định dạng
            });

            res.status(201).send({
                message: 'Đăng ký thành công!',
                data: createStudent
            });
    }
};

export default studentController;
