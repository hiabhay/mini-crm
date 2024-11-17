import React, { useState } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AudienceForm = () => {
  const [audienceSize, setAudienceSize] = useState(null);
  const navigate = useNavigate();

  const initialValues = {
    rules: [{ field: 'totalSpend', operator: '>', value: '' }],
    message: '',
    logicalOperator: 'AND',
  };

  const validationSchema = Yup.object().shape({
    rules: Yup.array().of(
      Yup.object().shape({
        field: Yup.string().required('Field is required'),
        operator: Yup.string().required('Operator is required'),
        value: Yup.string().required('Value is required'),
      })
    ),
    message: Yup.string().required('Message is required'),
    logicalOperator: Yup.string()
      .required('Logical operator is required')
      .oneOf(['AND', 'OR'], 'Logical operator must be either AND or OR'),
  });

  const handleCheckAudienceSize = async (values) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/campaigns/check-audience-size',
        values
      );
      setAudienceSize(response.data.audienceSize);
    } catch (error) {
      console.error('Error checking audience size', error.response.data);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await axios.post('http://localhost:5000/api/campaigns/create-audience', values);
      alert('Campaign created successfully');
      navigate('/home/audience');
    } catch (error) {
      console.error('Error creating audience', error.response.data);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#E8BCB9]">
      <div className="w-full max-w-lg p-6 bg-white shadow-md rounded-lg border border-[#432E54]">
        <h1 className="text-2xl font-bold text-center text-[#4B4376] mb-6">
          Create Campaign
        </h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <FieldArray name="rules">
                {({ remove, push }) => (
                  <div className="space-y-6">
                    {values.rules.map((rule, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-4 bg-[#E8BCB9] rounded-lg border border-[#432E54]"
                      >
                        <div className="flex-1">
                          <Field
                            name={`rules.${index}.field`}
                            as="select"
                            className="w-full p-2 border border-[#432E54] rounded-md"
                          >
                            <option value="totalSpend">Total Spend</option>
                            <option value="numVisits">Number of Visits</option>
                            <option value="lastVisitDate">Last Visit Date</option>
                          </Field>
                          <ErrorMessage
                            name={`rules.${index}.field`}
                            component="div"
                            className="text-[#AE445A] text-sm mt-1"
                          />
                        </div>
                        <div className="flex-1">
                          <Field
                            name={`rules.${index}.operator`}
                            as="select"
                            className="w-full p-2 border border-[#432E54] rounded-md"
                          >
                            <option value=">">Greater than</option>
                            <option value=">=">Greater than or equal</option>
                            <option value="<">Less than</option>
                            <option value="<=">Less than or equal</option>
                            <option value="=">Equal to</option>
                            <option value="!=">Not equal to</option>
                          </Field>
                          <ErrorMessage
                            name={`rules.${index}.operator`}
                            component="div"
                            className="text-[#AE445A] text-sm mt-1"
                          />
                        </div>
                        <div className="flex-1">
                          <Field
                            name={`rules.${index}.value`}
                            type={rule.field === 'lastVisitDate' ? 'date' : 'text'}
                            className="w-full p-2 border border-[#432E54] rounded-md"
                          />
                          <ErrorMessage
                            name={`rules.${index}.value`}
                            component="div"
                            className="text-[#AE445A] text-sm mt-1"
                          />
                        </div>
                        <button
                          type="button"
                          className="ml-2 p-2 bg-[#AE445A] text-white rounded-full hover:bg-[#4B4376]"
                          onClick={() => remove(index)}
                        >
                          X
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="w-full py-2 bg-[#4B4376] text-white rounded-lg hover:bg-[#AE445A]"
                      onClick={() => push({ field: '', operator: '', value: '' })}
                    >
                      Add Rule
                    </button>
                  </div>
                )}
              </FieldArray>

              <div className="mb-6">
                <Field
                  name="message"
                  type="text"
                  placeholder="Message"
                  className="w-full p-2 border border-[#432E54] rounded-md"
                />
                <ErrorMessage
                  name="message"
                  component="div"
                  className="text-[#AE445A] text-sm mt-1"
                />
              </div>

              <div className="mb-6">
                <Field
                  name="logicalOperator"
                  as="select"
                  className="w-full p-2 border border-[#432E54] rounded-md"
                >
                  <option value="AND">AND</option>
                  <option value="OR">OR</option>
                </Field>
                <ErrorMessage
                  name="logicalOperator"
                  component="div"
                  className="text-[#AE445A] text-sm mt-1"
                />
              </div>

              <div className="mb-6">
                <button
                  type="button"
                  className="w-full py-2 bg-[#AE445A] text-white rounded-lg hover:bg-[#4B4376]"
                  onClick={() => handleCheckAudienceSize(values)}
                >
                  Check Audience Size
                </button>
                {audienceSize !== null && (
                  <div className="mt-2 text-[#4B4376]">Audience Size: {audienceSize}</div>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-2 bg-[#AE445A] text-white rounded-lg hover:bg-[#4B4376]"
                  disabled={isSubmitting}
                >
                  Create Campaign
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AudienceForm;
