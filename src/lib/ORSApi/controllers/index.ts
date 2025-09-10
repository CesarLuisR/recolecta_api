import axios from "axios";
import { RequestHandler } from "express";
import config from "../../../config";

export const ORSApiSearchCtrl: RequestHandler = async (req, res, next) => {
    try {
        const { lat, lng } = req.body;
        const url = `https://us1.locationiq.com/v1/reverse.php?key=${config.ORSApiKey}&lat=${lat}&lon=${lng}&format=json`;

        const { data } = await axios.get<any>(url);
        return data;
    } catch (e) {
        next(e);
    }
}

export const ORSApiReverseCtrl: RequestHandler = async (req, res, next) => {
    try {
        const { lat, lng } = req.body;
        const url = `https://us1.locationiq.com/v1/reverse.php?key=${config.ORSApiKey}&lat=${lat}&lon=${lng}&format=json`;

        const { data } = await axios.get<any>(url);
        return data;
    } catch (e) {
        next(e);
    }
}

export const ORSApiOptimizeCtrl: RequestHandler = async (req, res, next) => {
    try {
        const { coordinates } = req.body;
        const url = `https://us1.locationiq.com/v1/optimize/driving/${coordinates}?key=${config.ORSApiKey}&roundtrip=false&source=first&destination=last&geometries=geojson`;

        const { data } = await axios.get<any>(url);
        return data;
    } catch (e) {
        next(e);
    }
}