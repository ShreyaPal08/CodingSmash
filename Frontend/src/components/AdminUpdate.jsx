

import { useForm, useFieldArray } from 'react-hook-form';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import axiosClient from '../utils/axiosClient';

function AdminUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const { fields: visibleFields, append: appendVisible, remove: removeVisible } =
    useFieldArray({
      control,
      name: 'visibleTestCases'
    });

  const { fields: hiddenFields, append: appendHidden, remove: removeHidden } =
    useFieldArray({
      control,
      name: 'hiddenTestCases'
    });

  // ✅ fetch problem data
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const { data } = await axiosClient.get(`/problem/problemById/${id}`);
        // yaha reset se form me values pre-fill ho jayengi
        reset(data);
      } catch (err) {
        alert('Failed to fetch problem');
      }
    };
    fetchProblem();
  }, [id, reset]);

  // ✅ submit update
  const onSubmit = async (formData) => {
    try {
      await axiosClient.put(`/problem/update/${id}`, formData);
      alert('Problem updated successfully!');
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Update Problem</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div className="form-control">
          <label className="label">Title</label>
          <input
            {...register('title')}
            className={`input input-bordered ${errors.title && 'input-error'}`}
          />
        </div>

        {/* Description */}
        <div className="form-control">
          <label className="label">Description</label>
          <textarea
            {...register('description')}
            className={`textarea textarea-bordered ${
              errors.description && 'textarea-error'
            }`}
          />
        </div>

        {/* Difficulty */}
        <div className="form-control">
          <label className="label">Difficulty</label>
          <select {...register('difficulty')} className="select select-bordered">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Tags */}
        <div className="form-control">
          <label className="label">Tags</label>
          <select {...register('tags')} className="select select-bordered">
            <option value="array">Array</option>
            <option value="linkedList">Linked List</option>
            <option value="graph">Graph</option>
            <option value="dp">DP</option>
          </select>
        </div>

        {/* Save button */}
        <button type="submit" className="btn btn-primary w-full">
          Update Problem
        </button>
      </form>
    </div>
  );
}

export default AdminUpdate;
