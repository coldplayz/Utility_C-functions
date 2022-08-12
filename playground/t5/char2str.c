#include <stdio.h>
#include <unistd.h>


/**
 * c2s - converts a character constant, or single-digit integer, to a string.
 * @c: a char
 * @i: an int
 * @flag: an int indicating whether the
 * output is from a char (0), or from an int (1).
 *
 * Return: a pointer to a string
 */
char *c2s(char c, int i, int flag)
{
	char *ptc;
	char arr[2];

	ptc = arr;
	if (flag)		/*for when the output string is to be from an integer*/
	{
		(void)c;	/*declare the variable, c, as unsused*/
		ptc[0] = i + '0';
		ptc[1] = '\0';
	}
	else
	{
		(void)i;
		ptc[0] = c;
		ptc[1] = '\0';
	}

	return (ptc);
}
