"use client";

import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { BookOpen, Binary, Focus, Database, Zap } from "lucide-react";
import Link from "next/link";

export default function About() {
  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Drive Health Predictor</h1>
        <p className="text-default-500">Predictive Maintenance Simulation</p>
      </div>

      <Divider />

      {/* Grid Layout */}
      <section className="grid grid-cols-12 gap-6">
        {/* Left Column - Wider */}
        <div className="col-span-8 space-y-6">
          {/* Project Overview */}
          <Card className="p-4">
            <CardHeader className="flex items-center gap-4 pb-2">
              <BookOpen className="text-primary" size={24} />
              <h2 className="text-xl font-semibold">Project Overview</h2>
            </CardHeader>
            <Divider className="mb-4" />
            <CardBody className="space-y-4">
              <p className="text-default-600">
                A conceptual demonstration of predictive maintenance for hard drives 
                using deep learning techniques, developed for academic and research purposes.
              </p>
              <div className="bg-primary-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 text-default-800">Key Objectives:</h3>
                <ul className="list-disc list-inside space-y-2 text-default-600">
                  <li>Demonstrate predictive maintenance concepts</li>
                  <li>Explore LSTM applications in time-series forecasting</li>
                  <li>Analyze storage system failure patterns</li>
                  <li>Develop actionable failure prediction thresholds</li>
                </ul>
              </div>
            </CardBody>
          </Card>

          {/* Technical Architecture */}
          <Card className="p-4">
            <CardHeader className="flex items-center gap-4 pb-2">
              <Binary className="text-secondary" size={24} />
              <h2 className="text-xl font-semibold">Technical Architecture</h2>
            </CardHeader>
            <Divider className="mb-4" />
            <CardBody className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-default-800">LSTM Encoder-Decoder</h3>
                  <p className="text-default-600">
                    Deep learning architecture using sequence-to-sequence model:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-default-600">
                    <li>50-day lookback window</li>
                    <li>7-day predictive horizon</li>
                    <li>Multi-feature attention</li>
                    <li>Anomaly scoring</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-default-800">Feature Engineering</h3>
                  <p className="text-default-600">
                    Synthesized drive health parameters:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-default-600">
                    <li>SMART attribute simulations</li>
                    <li>Temperature models</li>
                    <li>Usage pattern generation</li>
                    <li>Failure precursor signals</li>
                  </ul>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column - Narrower */}
        <div className="col-span-4 space-y-6">
          {/* Focused Analysis */}
          <Card className="p-4">
            <CardHeader className="flex items-center gap-4 pb-2">
              <Focus className="text-success" size={24} />
              <h2 className="text-xl font-semibold">Focused Analysis</h2>
            </CardHeader>
            <Divider className="mb-4" />
            <CardBody>
              <div className="grid grid-cols-1 gap-4">
                {['Reduce Complexity', 'Establish Baselines', 'Cost Efficiency'].map((title, index) => (
                  <div key={title} className="p-4 bg-success-50 rounded-lg">
                    <h4 className="font-semibold text-default-800">{title}</h4>
                    <p className="text-sm text-default-600">
                      {index === 0 ? 'Clear signal isolation' : 
                       index === 1 ? 'Controlled environment' : 
                       'Optimized computational needs'}
                    </p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Dataset Section */}
          <Card className="p-4">
            <CardHeader className="flex items-center gap-4 pb-2">
              <Database className="text-warning" size={24} />
              <h2 className="text-xl font-semibold">Data Foundation</h2>
            </CardHeader>
            <Divider className="mb-4" />
            <CardBody>
              <div className="bg-warning-50 p-4 rounded-lg">
                <Link 
                  href="https://www.backblaze.com/b2/hard-drive-test-data.html"
                  className="text-warning hover:text-warning-700 flex items-center"
                >
                  <Database className="mr-2" size={18} />
                  Original Backblaze Drive Data
                </Link>
                <p className="mt-2 text-sm text-default-600">
                  Synthetic dataset using Backblaze drive statistics patterns
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Footer CTA */}
      <div className="text-center mt-20"> 
      <Link href="/">
  <Button 
    color="primary" 
    variant="shadow" 
    size="lg"
    startContent={<Zap size={18} />}
  >
    Explore Dashboard
  </Button>
</Link>
        <p className="text-sm text-default-500 mt-4">
          Academic project only. Predictive outcomes are simulative.
        </p>
      </div>
    </div>
  );
}