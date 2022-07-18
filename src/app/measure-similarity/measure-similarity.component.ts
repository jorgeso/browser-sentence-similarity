import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder'
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-measure-similarity',
  templateUrl: './measure-similarity.component.html',
  styleUrls: ['./measure-similarity.component.scss']
})
export class MeasureSimilarityComponent implements OnInit {
  model?: use.UniversalSentenceEncoder;
  sentence_one = "Universal Sentence Encoder encodes entire sentence or text into vectors of real numbers that can be used for clustering, sentence similarity, text classification, and other Natural language processing (NLP) tasks.";
  sentence_two = "Bidirectional Encoder Representations from Transformers (BERT) is a transformer-based machine learning technique for natural language processing (NLP) pre-training developed by Google.";
  loading = true;
  distance: number;
  distance_label: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    if (isPlatformBrowser(this.platformId)) {
      tf.setBackend('webgl');
    }
  }

  ngOnInit(): void {
    use.load().then(model => {
      this.model = model
      this.calculateSimilarity()
    })
  }

  calculateSimilarity(): void {
    this.loading = true
    const promises = []
    promises.push(this.model.embed(this.sentence_one))
    promises.push(this.model.embed(this.sentence_two))

    Promise.all(promises).then(embeddings => {
      console.log(embeddings);
      const emb_1 = embeddings[0]
      const emb_2 = embeddings[1]
      var distance = tf.sub(1, tf.metrics.cosineProximity(emb_1, emb_2).mul(-1))
      distance.print()
      // const product = tf.dot(emb_1.reshape([1, -1]), emb_2.reshape([-1, 1]))
      // const emb_1_norm = tf.norm(emb_1, 'euclidean')
      // const emb_2_norm = tf.norm(emb_2, 'euclidean')
      // const norm_product = tf.mul(emb_1_norm, emb_2_norm)
      // const similarity = tf.div(product, norm_product)
      // similarity.print()
      this.loading = false
      distance.data().then(value => {
        if (value[0] <= 0.2) {
          this.distance_label = "Sentences are very similar";
        } else if (value[0] > 0.2 && value[0] <= 0.4) {
          this.distance_label = "Sentences are somewhat similar";
        } else if (value[0] > 0.4 && value[0] <= 0.6) {
          this.distance_label = "Sentences are neutral";
        } else if (value[0] > 0.6 && value[0] <= 0.8) {
          this.distance_label = "Sentences are somewhat disimilar";
        } else {
          this.distance_label = "Sentences are very disimilar";
        }
        this.distance = value[0]
      })
    })
  }

}
