import UserModel from '@schemas/users.s';
import TeacherModel from '@schemas/teachers.s';
//import StudentModel from "@schemas/students.s";

const setUp = async () => {
  let user = await UserModel.findOne({
    'login.username': 'admin',
  });
  if (user !== null) {
    return;
  }

  console.log('setting up a new admin user');
  user = await UserModel.create({
    name: 'admin',
    lastname: 'admin',
    birthday: new Date(),
    login: {
      username: 'admin',
      email: 'admin@admin.com',
      password: 'admin',
      provider: 'local',
    },
    status: 'active',
    role: 'teacher',
  });

  await user.save();
  console.log('admin user created');
  console.log(user.toClient());
  console.log('setting up a new teacher');

  const teacher = await TeacherModel.create({
    name: 'admin',
    lastname: 'admin',
    birthday: new Date(),
    user: user._id.toString(),
  });

  await teacher.save();
  console.log('teacher created');
  console.log(teacher.toClient());
  return;
};

export default setUp;
