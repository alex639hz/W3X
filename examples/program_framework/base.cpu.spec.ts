import { Test, TestingModule } from '@nestjs/testing';
import { CPU } from './base.cpu';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('engine.base', () => {
  const conf = {};
  const collection = [];
  let cpu: CPU = null;

  beforeEach(async () => {});

  it('should be defined', () => {
    cpu = new CPU(conf, collection);
    expect(cpu).toBeDefined();
  });
});
