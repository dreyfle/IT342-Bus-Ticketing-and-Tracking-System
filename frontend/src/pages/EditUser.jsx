import { useParams } from 'react-router-dom';

const EditUser = () => {
  const { id } = useParams();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Edit User #{id}</h1>
      <p>This is where your edit form will go.</p>
    </div>
  );
};

export default EditUser;