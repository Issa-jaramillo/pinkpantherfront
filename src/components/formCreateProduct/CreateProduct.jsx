import React from 'react'
import AddingImages from './AddingImages';
import axios from "axios";
import { useState, useEffect } from 'react';
import validation from './validation';
import { Card, CardHeader, CardBody, CardFooter, Typography } from "@material-tailwind/react";
import { Button } from "@material-tailwind/react";
import { Link } from 'react-router-dom'
import { URL_LINK } from '../../URL';

const URL_PRODUCT =  `${URL_LINK}/product`;
const URL_CATEGORIES = `${URL_LINK}/categories`;


const CreateProduct =({ initialValues })=>{
    const [productData, setProductData] = useState(() => {
        if (!initialValues) {
            return {
                name: "",
                color: "",
                priceEfectivo: 0,
                priceCuotas: 0,
                size: "",
                quantity: 0,
                photo: "",
                supplier: "",
                enable: true,
                Categories: []
            };
        } else {
            return {
                id: initialValues.id,
                name: initialValues.name,
                color: initialValues.color,
                priceEfectivo: initialValues.priceEfectivo,
                priceCuotas: initialValues.priceCuotas,
                size: initialValues.size,
                quantity: initialValues.quantity,
                photo: initialValues.photo,
                supplier: initialValues.supplier,
                enable: initialValues.enable,
                Categories: initialValues.Categories || []
            };
        }
    });



    const [Categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect( () => {
        axios.get(URL_CATEGORIES)
        .then( ({ data }) => {
            setCategories(data)
        })
        .catch(error => console.error(error));
    }, []);

    const handleChange = (event) => {
        setProductData({...productData, [event.target.name]:event.target.value });
    }

    const handleCategoriesChange = (event) => {
        const categoryId = event.target.value;
    
        const categoryIndex = productData.Categories.findIndex(c => c.id === categoryId);
    
        if (categoryIndex !== -1) {
            const updatedCategories = [...productData.Categories];
            updatedCategories.splice(categoryIndex, 1);
            setProductData(prevData => ({
                ...prevData,
                Categories: updatedCategories
            }));
        } else {
            const category = Categories.find(c => c.id === categoryId);
            setProductData(prevData => ({
                ...prevData,
                Categories: [...prevData.Categories, category]
            }));
        }
    }

    const handleNumberChange = (event) => {
        const fieldName = event.target.name;
        const fieldValue = parseFloat(event.target.value);
    
        setProductData(prevData => ({
            ...prevData,
            [fieldName]: fieldValue 
        }));

        setErrors(prevErrors => ({
            ...prevErrors,
            [fieldName]: validation({ ...productData, [fieldName]: fieldValue })[fieldName]
        }));
    }

    const handlePost = async (event) => {
        event.preventDefault();
        const validationErrors = validation(productData);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            try {
                const response = await axios.post(URL_PRODUCT, productData);
                if (response.status === 201) {
                    alert("Tu producto se guardó correctamente");
                    setProductData({
                        name: "",
                        color: "",
                        priceEfectivo: 0,
                        priceCuotas: 0,
                        size: "",
                        quantity: 0,
                        photo: "",
                        supplier: "",
                        enable: true,
                        Categories: []
                    });
                } else {
                    throw new Error("Error al guardar tu producto");
                }
            } catch (error) {
                console.error("Error al guardar tu producto: ", error);
            }
        } else {
            alert("Faltan datos o hay errores en el formulario");
        }
    }

    const handlePut = async (event) => {
        event.preventDefault();
        const validationErrors = validation(productData);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            try {
                const response = await axios.put(`${URL_PRODUCT}/${productData.id}`, productData);
                if (response.status === 200) {
                    alert("Tu producto se actualizó correctamente");
                } else {
                    throw new Error("Error al actualizar tu producto");
                }
            } catch (error) {
                console.error("Error al actualizar tu producto: ", error);
            }
        } else {
            alert("Faltan datos o hay errores en el formulario");
        }
    }

    return( 
        <div className="grid grid-cols-1 items-center justify-items-center min-h-full mt-8">
            <Card className="w-full max-w-md">
            <form onSubmit={initialValues && Object.keys(initialValues).length !== 0 ? handlePut : handlePost} >
                <CardHeader variant="gradient" color="pink" className="mb-4 grid h-28 place-items-center">
                <Typography variant="h3" color="black">
                Producto
                </Typography>
                </CardHeader>
                <CardBody className="flex flex-col gap-4"></CardBody>
                <div className="flex flex-col gap-1">
                <Typography variant="p" color="black" className="mb-1">
                    <b>Nombre:</b>
                </Typography>
                <div className="flex flex-col">
                    <input className={errors.email ? "input-box border-2 rounded-lg border-red-400 px-4 py-2" : "input-box border-2 rounded-lg border-gray-400 px-4 py-2" }
                    type='text' 
                    placeholder='Ingrese el nombre del producto' 
                    id='name' 
                    name='name' 
                    value={productData.name} 
                    onChange={handleChange}/> 
                    {errors.name && <span>{errors.name}</span>}
                    </div>
                    </div>
                <br />
                <label>
                    Color:
                    <input type='text' placeholder='Ingrese el/los color/es' id='color' name='color' value={productData.color} onChange={handleChange}/>
                    {errors.color && <span>{errors.color}</span>}
                </label>
                <br />
                <label>
                    Precio efectivo:
                    <input type='number' placeholder='Ingrese el precio en efectivo' id='priceEfectivo' name='priceEfectivo' value={productData.priceEfectivo} onChange={handleNumberChange}/>
                    {errors.priceEfectivo && <span>{errors.priceEfectivo}</span>}
                </label>
                <br />
                <label>
                    Precio cuotas:
                    <input type='number' placeholder='Ingrese el precio en cuotas' id='priceCuotas' name='priceCuotas' value={productData.priceCuotas} onChange={handleNumberChange}/>
                    {errors.priceCuotas && <span>{errors.priceCuotas}</span>}
                </label>
                <br />
                <label>
                    Talle:
                    <input type='text' placeholder='Ingrese el/los talle/s' id='size' name='size' value={productData.size} onChange={handleChange}/> 
                    {errors.size && <span>{errors.size}</span>}
                </label>
                <br />
                <label>
                    Cantidad:
                    <input type='number' placeholder='Ingrese el stock disponible' id='quantity' name='quantity' value={productData.quantity} onChange={handleNumberChange}/>
                    {errors.quantity && <span>{errors.quantity}</span>}
                </label>
                <br />
                <label>
                    Fábrica:
                    <input type='text' placeholder='Ingrese la fábrica del producto' id='supplier' name='supplier' value={productData.supplier} onChange={handleChange}/> 
                    {errors.supplier && <span>{errors.supplier}</span>}
                </label>
                <br />
                <label>
                    Categorías:
                    <select size="5" multiple value={productData.Categories} onChange={handleCategoriesChange}>
                        {Categories.map((c) => {
                            if (c.name !== "about us") {
                                return <option key={c.id} value={c.id}>{c.name}</option>
                            }
                        })}
                    </select>
                    {errors.Categories && <span>{errors.Categories}</span>}
                </label>
                <br />
                <label>
                    Categorías seleccionadas:
                    <input type="text" readOnly value={productData.Categories && productData.Categories.map(c => {
                    return c ? c.name : ''; 
                    }).join(', ')} />
                </label>
                <br />
                <label>
                    Imagen del producto:
                    <AddingImages setProduct={setProductData} productData={productData} />
                    {errors.photo && <span>{errors.photo}</span>}
                </label>
                <CardFooter className="pt-0 mt-5">
                <div style={{ display: 'flex', gap: '10px' }}>
                <Button type="submit"
                className="text-white bg-pink-500" variant="gradient">
                    {initialValues && Object.keys(initialValues).length !== 0 ? 'Actualizar Producto' : 'Crear Producto'}
                </Button>
                <br />
                <Link to='/admin'>
                    <Button className="text-white bg-pink-500" variant="gradient">
                    Volver
                    </Button>
                </Link>
                </div>
                </CardFooter>                                                                                                                                                                                   
            </form>
            </Card>
        </div>                                                                                                                                                                                                      
    )
}                                                                                                                                                                                                                                                                                       

export default CreateProduct;
