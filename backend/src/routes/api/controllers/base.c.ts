import Mongoose from 'mongoose';
import { Request, Response } from 'express';
import { z } from 'zod';
import { isJSON } from '@utils/isJson';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
const OptionZod = z.object({
  filter: z.record(z.string(), z.any()).default({}),
  limit: z.number().or(z.string().pipe(z.coerce.number())).default(10),
  skip: z.number().or(z.string().pipe(z.coerce.number())).default(0),
  sort: z.record(z.string(), z.union([z.literal('asc'), z.literal('desc'), z.literal(1), z.literal(-1)])).default({}),
});
type Options = z.infer<typeof OptionZod>;

class BaseController<T extends Y & { toClient: () => Y } & Mongoose.Document, Y> {
  protected model: Mongoose.Model<T>;
  // eslint-disable-next-line no-unused-vars
  protected Verify: (data: unknown) => Promise<VerifyReturn<Y>>;
  public name: string;
  // eslint-disable-next-line no-unused-vars
  constructor(model: Mongoose.Model<T>, verify: (data: unknown) => Promise<any>) {
    this.model = model;
    this.Verify = verify;
    this.name = this.model.collection.name;
    if (this.name.endsWith('s')) this.name = this.name.slice(0, -1);
    if (this.name === 'matche') this.name = 'match';
  }

  private GetOptions = (req: Request): Options => {
    let object: unknown = req.query.filter;
    if (!object) object = '{}';
    object = isJSON(req.query.filter as string);
    let result = OptionZod.safeParse(object);
    result = !result.success ? OptionZod.safeParse({}) : result;

    return (result as any).data as Options;
  };

  public GetAll = async (req: Request, res: Response) => {
    const filter = this.GetOptions(req);
    const data = await this.model.find(filter.filter).limit(filter.limit).skip(filter.skip).sort(filter.sort);
    if (!data) {
      res.status(404).send({ message: 'Not found' });
      return;
    }
    res.send(data.map((item) => item.toClient()));
  };

  public GetOne = async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).send({ message: 'Missing or invalid id' });
      return;
    }
    const data = await this.model.findOne({ _id: id });
    if (!data) {
      res.status(404).send({ message: 'Not found' });
      return;
    }
    res.send(data.toClient());
  };

  public Create = async (req: Request, res: Response) => {
    if (!req.body[this.name]) {
      res.status(400).send({ message: 'Missing data', where: this.name });
      return;
    }
    const data = await this.Verify(req.body[this.name]);
    if (!data.success) {
      res.status(400).send({ message: data.error });
      return;
    }

    const collection = new this.model(data.data);
    if (this.name === 'game' && (data.data as any).type === 'map') {
      const mapSVG = req.body.file;
      if (!mapSVG) {
        res.status(400).send({ message: 'Missing mapSVG' });
        return;
      }
      if (!fs.existsSync(path.join(__dirname, '../../../../public/maps'))) {
        fs.mkdirSync(path.join(__dirname, '../../../../public/maps'));
      }
      fs.writeFile(path.join(__dirname, `../../../../public/maps/${collection._id.toString()}.svg`), mapSVG, (err) => {
        if (err) {
          res.status(500).send({ message: 'Error saving mapSVG' });
          return;
        }
      });
    }
    await collection.save();
    res.send(collection.toClient());
  };

  public Update = async (req: Request, res: Response) => {
    if (!req.body[this.name]) {
      res.status(400).send({ message: 'Missing data', where: this.name });
      return;
    }
    const data = await this.Verify(req.body[this.name]);
    if (!data.success) {
      res.status(400).send({ message: data.error });
      return;
    }
    const collection = await this.model.findById((data.data as any).id);
    if (!collection) {
      res.status(404).send({ message: 'Not found' });
      return;
    }
    collection.set(data.data);
    if (this.name === 'game' && (data.data as any).type === 'map') {
      const mapSVG = req.body.file;
      if (mapSVG) {
        if (!fs.existsSync(path.join(__dirname, '/public/maps'))) {
          fs.mkdirSync(path.join(__dirname, '/public/maps'));
        }
        fs.writeFile(path.join(__dirname, `/public/maps/${collection._id.toString()}.svg`), mapSVG, (err) => {
          if (err) {
            res.status(500).send({ message: 'Error saving mapSVG' });
            return;
          }
        });
      }
    }
    await collection.save();
    res.send(collection.toClient());
  };

  public Delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).send({ message: 'Missing or invalid id' });
      return;
    }
    const process = await this.model.findByIdAndDelete(id);
    if (!process) {
      res.status(404).send({ message: 'Not found' });
      return;
    }
    res.send({ message: 'Deleted' });
  };
}

type VerifyReturn<T> = {
  success: boolean;
  data: T;
  error?: z.SafeParseError<T>;
};

export default BaseController;
