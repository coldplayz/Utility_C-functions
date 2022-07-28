#include "main.h"

/**
 * strnumsum2int - add to integer characters and returns their sum
 * @c1: a character constant of form '0' to '9'
 * @c2: a character constant of form '0' to '9'
 *
 * Return: an integer sum of c1 and c2
 */
int strnumsum2int(char c1, char c2)
{
	int i, j, n1, n2;
	
	j = 0;
	for (i = 0; i < 10; i++)
	{
		if (c1 == (i + '0'))
		{
			n1 = i;
		}
		if (c2 == (j + '0'))
		{
			n2 = j;
		}
		j++;
	}

	return (n1 + n2);
}
