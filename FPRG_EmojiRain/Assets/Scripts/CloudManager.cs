using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CloudManager : MonoBehaviour
{
    public string lastEmoji;

    [SerializeField] GameObject[] emojis;
    [SerializeField] GameObject canvasGO;
    [SerializeField] CollisionManager collManager;

    Vector3 dir;
    float speed;
    bool emojisSpawned;

    void Start() {
        dir = Vector3.left;
        speed = 3f;
        emojisSpawned = true;
    }

    void Update() {
        if(collManager.hitCounter != -1) {
            transform.Translate(dir*speed*Time.deltaTime);

            if(transform.position.x < -5.75f) {
                dir = Vector3.right;
                speed = Random.Range(3f, 10f);
                emojisSpawned = false;
            } else if(transform.position.x > 5.75f) {
                dir = Vector3.left;
                speed = Random.Range(3f, 10f);
                emojisSpawned = true;
            }

            if(transform.position.x >= 0.001f && !emojisSpawned) {
                emojisSpawned = true;
                int randEmoji = Random.Range(0, emojis.Length);
                float randPos = Random.Range(-250f, 250f);
                lastEmoji = emojis[randEmoji].name;
                GameObject emojiInst = Instantiate(emojis[randEmoji], new Vector3(randPos, 280f, 0f), Quaternion.identity);
                emojiInst.transform.SetParent(canvasGO.transform, false);
            }
        }
    }
}
